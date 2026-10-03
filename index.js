import { PRODUCTS_DATA, state } from './shared.js';
import {
    loadCartFromStorage,
    updateCartBadge,
    addToCart,
    toggleCartDrawer,
    renderCartDrawer,
    updateCartQuantity,
    removeFromCart,
    applyPromoCode,
    handleOpenCheckout,
    finishCheckoutProcess
} from './cart.js';

function switchView(viewName) {
            const shopSection = document.getElementById('shop-view');
            const aboutSection = document.getElementById('about-view');
            const navShop = document.getElementById('nav-shop');
            const navAbout = document.getElementById('nav-about');

            if (viewName === 'about') {
                shopSection.classList.add('hidden-view');
                aboutSection.classList.remove('hidden-view');
                navAbout.classList.add('active');
                navShop.classList.remove('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                aboutSection.classList.add('hidden-view');
                shopSection.classList.remove('hidden-view');
                navShop.classList.add('active');
                navAbout.classList.remove('active');
            }
        }

function filterByCategory(cat) {
            state.category = cat;
            const pills = document.querySelectorAll('.category-pills .pill-btn');
            pills.forEach(pill => {
                if (pill.dataset.category === cat) {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });
            renderProducts();
        }

function handleSearchInput(value) {
            state.searchQuery = value.trim().toLowerCase();
            renderProducts();
        }

function handlePriceRange(value) {
            state.maxPrice = parseFloat(value);
            document.getElementById('price-limit-display').textContent = `$${value}`;
            renderProducts();
        }

function handleSortChange(value) {
            state.sortBy = value;
            renderProducts();
        }

function resetAllFilters() {
            state.category = "All";
            state.searchQuery = "";
            state.maxPrice = 400;
            state.sortBy = "featured";

            document.getElementById('search-input').value = "";
            document.getElementById('price-range').value = 400;
            document.getElementById('price-limit-display').textContent = "$400";
            document.getElementById('sort-select').value = "featured";

            filterByCategory("All");
        }

function scrollToSearch() {
            switchView('shop');
            const searchInput = document.getElementById('search-input');
            searchInput.focus();
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

function renderProducts() {
            const grid = document.getElementById('products-grid');
            const noProductsState = document.getElementById('no-products-state');
            const countDisplay = document.getElementById('product-count');
            const filterTagsContainer = document.getElementById('active-filter-tags');

            let filtered = PRODUCTS_DATA.filter(item => {
                const matchesCategory = (state.category === "All") || (item.category === state.category);
                const matchesPrice = item.price <= state.maxPrice;
                const matchesSearch = state.searchQuery === "" || 
                    item.name.toLowerCase().includes(state.searchQuery) || 
                    item.category.toLowerCase().includes(state.searchQuery) ||
                    item.description.toLowerCase().includes(state.searchQuery);
                return matchesCategory && matchesPrice && matchesSearch;
            });

            if (state.sortBy === "price-low") {
                filtered.sort((a, b) => a.price - b.price);
            } else if (state.sortBy === "price-high") {
                filtered.sort((a, b) => b.price - a.price);
            } else if (state.sortBy === "name-az") {
                filtered.sort((a, b) => a.name.localeCompare(b.name));
            } else if (state.sortBy === "name-za") {
                filtered.sort((a, b) => b.name.localeCompare(a.name));
            }

            countDisplay.textContent = filtered.length;

            let activeTagsHTML = '';
            if (state.category !== 'All') {
                activeTagsHTML += `<span class="tag-badge">Category: ${state.category} <button onclick="filterByCategory('All')">✕</button></span>`;
            }
            if (state.maxPrice < 400) {
                activeTagsHTML += `<span class="tag-badge">Under $${state.maxPrice} <button onclick="handlePriceRange(400); document.getElementById('price-range').value=400;">✕</button></span>`;
            }
            if (state.searchQuery !== '') {
                activeTagsHTML += `<span class="tag-badge">Query: "${state.searchQuery}" <button onclick="document.getElementById('search-input').value=''; handleSearchInput('');">✕</button></span>`;
            }
            if (activeTagsHTML !== '') {
                activeTagsHTML += `<button onclick="resetAllFilters()" style="background:none; border:none; color:var(--bronze); font-size:11px; cursor:pointer; text-decoration:underline; margin-left:0.5rem;">Reset All</button>`;
            }
            filterTagsContainer.innerHTML = activeTagsHTML;

            if (filtered.length === 0) {
                grid.innerHTML = '';
                noProductsState.classList.add('visible');
                return;
            } else {
                noProductsState.classList.remove('visible');
            }

            grid.innerHTML = filtered.map(product => `
                <div class="product-card">
                    <div>
                        <div class="product-img-container" onclick="openQuickView(${product.id})">
                            <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async" onerror="this.src='https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop'">
                            <span class="product-category-tag">${product.category}</span>
                            <button class="quick-view-icon-btn" onclick="event.stopPropagation(); openQuickView(${product.id})" title="Quick View">
                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            </button>
                        </div>
                        <div class="product-details">
                            <div class="product-title-price">
                                <h3 class="product-title">${product.name}</h3>
                                <span class="product-price">$${product.price}</span>
                            </div>
                            <p class="product-desc">${product.description}</p>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button onclick="addToCart(${product.id}, 'M', 1)" class="btn-card-add">Add to Bag</button>
                        <button onclick="openQuickView(${product.id})" class="btn-card-detail" title="View Details">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
            `).join('');
        }

function openQuickView(productId) {
            const product = PRODUCTS_DATA.find(p => p.id === productId);
            if (!product) return;

            state.currentQuickViewId = productId;
            state.selectedQuickViewSize = "S";

            document.getElementById('qv-image').src = product.image;
            document.getElementById('qv-category-badge').textContent = product.category;
            document.getElementById('qv-title').textContent = product.name;
            document.getElementById('qv-price').textContent = `$${product.price}`;
            document.getElementById('qv-desc').textContent = product.description;
            document.getElementById('qv-specs-material').textContent = product.material;
            document.getElementById('qv-specs-fit').textContent = product.fit;

            selectQuickViewSize('S');

            const modal = document.getElementById('quick-view-modal');
            modal.classList.add('open');
            modal.querySelector('.modal-card').scrollTop = 0;

            document.getElementById('qv-add-btn').onclick = () => {
                addToCart(product.id, state.selectedQuickViewSize, 1);
                closeQuickView();
            };
        }

function selectQuickViewSize(size) {
            state.selectedQuickViewSize = size;
            const sizeBtns = document.querySelectorAll('.qv-size-btn');
            sizeBtns.forEach(btn => {
                if (btn.textContent.trim() === size) {
                    btn.style.backgroundColor = 'var(--bronze)';
                    btn.style.color = 'var(--onyx)';
                    btn.style.borderColor = 'var(--bronze)';
                    btn.style.fontWeight = '700';
                } else {
                    btn.style.backgroundColor = 'var(--charcoal)';
                    btn.style.color = 'var(--subtle-text)';
                    btn.style.borderColor = 'var(--muted-border)';
                    btn.style.fontWeight = '400';
                }
            });
        }

function closeQuickView() {
            document.getElementById('quick-view-modal').classList.remove('open');
        }

function handleContactSubmit(event) {
            event.preventDefault();
            const name = document.getElementById('contact-name').value;
            showToast(`Thank you ${name}, your concierge message was transmitted.`);
            document.getElementById('contact-form').reset();
        }

function handleNewsletterSubmit(event) {
            event.preventDefault();
            showToast("Subscribed to Private Atelier Dispatch!");
            event.target.reset();
        }

function showToast(message) {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = 'toast-item';
            toast.innerHTML = `
                <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--bronze);"></span>
                <span>${message}</span>
            `;
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(10px)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }

function openMobileMenu() {
            document.getElementById('mobile-menu').classList.add('open');
        }

function closeMobileMenu() {
            document.getElementById('mobile-menu').classList.remove('open');
        }

document.addEventListener("DOMContentLoaded", () => {
    loadCartFromStorage();
    renderProducts();
    updateCartBadge();

    const hash = window.location.hash.replace('#', '');
    if (hash === 'about') {
        switchView('about');
    } else {
        switchView('shop');
    }

    document.getElementById('mobile-menu-btn').addEventListener('click', openMobileMenu);
    document.getElementById('close-mobile-menu').addEventListener('click', closeMobileMenu);
});

// Mobile / touch behaviour
document.addEventListener("DOMContentLoaded", () => {
    // Lock page scroll while the menu, bag or a modal is open
    const lockTargets = ['cart-drawer', 'quick-view-modal', 'checkout-modal', 'mobile-menu'];
    const syncScrollLock = () => {
        const anyOpen = document.querySelector('.cart-drawer.open, .modal-overlay.open, .mobile-menu-overlay.open');
        document.body.classList.toggle('no-scroll', !!anyOpen);
    };
    const observer = new MutationObserver(syncScrollLock);
    lockTargets.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    });

    // Tap-to-open category dropdown (hover doesn't exist on touch screens)
    document.querySelectorAll('.dropdown').forEach(dd => {
        const toggle = dd.querySelector('.dropdown-toggle');
        toggle.addEventListener('click', e => {
            e.stopPropagation();
            const isOpen = dd.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen);
        });
    });
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    });

    // Tap the dark backdrop to close the quick-view modal
    const qv = document.getElementById('quick-view-modal');
    qv.addEventListener('click', e => { if (e.target === qv) closeQuickView(); });

    // Escape closes everything
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeMobileMenu();
            closeQuickView();
            toggleCartDrawer(false);
        }
    });

    // Close the mobile menu if the screen grows past the mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) closeMobileMenu();
    });
});

// Backward compatibility for existing inline HTML handlers.
Object.assign(window, {
    switchView, filterByCategory, handleSearchInput, handlePriceRange, handleSortChange,
    resetAllFilters, scrollToSearch, renderProducts, openQuickView, selectQuickViewSize,
    closeQuickView, openMobileMenu, closeMobileMenu, toggleCartDrawer, addToCart,
    updateCartQuantity, removeFromCart, applyPromoCode, renderCartDrawer, updateCartBadge,
    handleOpenCheckout, finishCheckoutProcess, handleContactSubmit, handleNewsletterSubmit,
    showToast
});
