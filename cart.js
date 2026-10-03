import { PRODUCTS_DATA, state } from './shared.js';

function toggleCartDrawer(open) {
            const drawer = document.getElementById('cart-drawer');
            const backdrop = document.getElementById('cart-drawer-backdrop');

            if (open) {
                renderCartDrawer();
                drawer.classList.add('open');
                backdrop.classList.add('open');
            } else {
                drawer.classList.remove('open');
                backdrop.classList.remove('open');
            }
        }

function addToCart(productId, size = 'M', quantity = 1) {
            const product = PRODUCTS_DATA.find(p => p.id === productId);
            if (!product) return;

            const existingIndex = state.cart.findIndex(item => item.id === productId && item.size === size);
            if (existingIndex > -1) {
                state.cart[existingIndex].quantity += quantity;
            } else {
                state.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                    size: size,
                    quantity: quantity
                });
            }

            saveCartToStorage();
            updateCartBadge();
            window.showToast(`Added "${product.name}" (${size}) to shopping bag.`);
            toggleCartDrawer(true);
        }

function updateCartQuantity(index, change) {
            if (state.cart[index]) {
                state.cart[index].quantity += change;
                if (state.cart[index].quantity <= 0) {
                    state.cart.splice(index, 1);
                }
                saveCartToStorage();
                renderCartDrawer();
                updateCartBadge();
            }
        }

function removeFromCart(index) {
            if (state.cart[index]) {
                const removedName = state.cart[index].name;
                state.cart.splice(index, 1);
                saveCartToStorage();
                renderCartDrawer();
                updateCartBadge();
                window.showToast(`Removed "${removedName}" from bag.`);
            }
        }

function applyPromoCode() {
            const code = document.getElementById('promo-code-input').value.trim().toUpperCase();
            if (code === 'PROMO10') {
                state.discountApplied = true;
                window.showToast('10% Promo discount code applied!');
                renderCartDrawer();
            } else {
                window.showToast('Invalid promo code. Use PROMO10');
            }
        }

function renderCartDrawer() {
            const container = document.getElementById('cart-items-container');
            const subtotalElem = document.getElementById('cart-subtotal');
            const discountRow = document.getElementById('discount-row');
            const discountElem = document.getElementById('cart-discount');
            const shippingElem = document.getElementById('cart-shipping');
            const totalElem = document.getElementById('cart-total');
            const checkoutBtn = document.getElementById('checkout-btn');

            if (state.cart.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 4rem 1rem; color: var(--subtle-text);">
                        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 1rem auto; color: var(--muted-border);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        <p style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--alabaster); margin-bottom: 0.5rem;">Your Shopping Bag is Empty</p>
                        <p style="font-size: 12px; max-width: 260px; margin: 0 auto 1.5rem auto;">Explore our studio vault and discover architectural garments.</p>
                        <button onclick="toggleCartDrawer(false)" class="btn-primary" style="padding: 0.75rem 1.5rem;">Start Shopping</button>
                    </div>
                `;
                subtotalElem.textContent = "$0.00";
                discountRow.style.display = 'none';
                shippingElem.textContent = "$0.00";
                totalElem.textContent = "$0.00";
                checkoutBtn.disabled = true;
                checkoutBtn.style.opacity = '0.5';
                checkoutBtn.style.cursor = 'not-allowed';
                return;
            }

            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
            checkoutBtn.style.cursor = 'pointer';

            container.innerHTML = state.cart.map((item, idx) => `
                <div class="cart-item-row">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=200&auto=format&fit=crop'">
                    <div style="flex-grow: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <h4 style="font-family: var(--font-serif); font-size: 1rem; color: var(--alabaster);">${item.name}</h4>
                            <button class="cart-remove-btn" aria-label="Remove item" onclick="removeFromCart(${idx})">✕</button>
                        </div>
                        <div style="font-size: 11px; color: var(--subtle-text); margin-top: 2px;">Size: <span style="color: var(--bronze); font-weight: 700;">${item.size}</span></div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem;">
                            <span style="font-family: var(--font-mono, monospace); font-size: 12px; color: var(--alabaster); font-weight: 600;">$${item.price}</span>
                            <div style="display: flex; align-items: center; border: 1px solid var(--muted-border); border-radius: 3px; background: var(--onyx);">
                                <button class="qty-btn" aria-label="Decrease quantity" onclick="updateCartQuantity(${idx}, -1)">-</button>
                                <span style="padding: 0 6px; font-family: var(--font-mono, monospace); font-size: 12px; color:var(--alabaster);">${item.quantity}</span>
                                <button class="qty-btn" aria-label="Increase quantity" onclick="updateCartQuantity(${idx}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

            const rawSubtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            let discountAmount = state.discountApplied ? (rawSubtotal * 0.10) : 0;
            const shipping = rawSubtotal > 150 ? 0 : 15;
            const grandTotal = (rawSubtotal - discountAmount) + shipping;

            subtotalElem.textContent = `$${rawSubtotal.toFixed(2)}`;
            if (state.discountApplied) {
                discountRow.style.display = 'flex';
                discountElem.textContent = `-$${discountAmount.toFixed(2)}`;
            } else {
                discountRow.style.display = 'none';
            }

            shippingElem.textContent = shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
            totalElem.textContent = `$${grandTotal.toFixed(2)}`;
        }

function updateCartBadge() {
            const badge = document.getElementById('cart-badge-count');
            const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalCount;
            badge.style.transform = 'scale(1.25)';
            setTimeout(() => badge.style.transform = 'scale(1)', 200);
        }

function handleOpenCheckout() {
            if (state.cart.length === 0) return;
            toggleCartDrawer(false);

            const rawSubtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            let discountAmount = state.discountApplied ? (rawSubtotal * 0.10) : 0;
            const shipping = rawSubtotal > 150 ? 0 : 15;
            const grandTotal = (rawSubtotal - discountAmount) + shipping;

            const randomRef = '#VA-' + Math.floor(10000 + Math.random() * 90000);
            document.getElementById('checkout-ref-id').textContent = randomRef;
            document.getElementById('checkout-modal-total').textContent = `$${grandTotal.toFixed(2)}`;

            document.getElementById('checkout-modal').classList.add('open');
        }

function finishCheckoutProcess() {
            state.cart = [];
            state.discountApplied = false;
            saveCartToStorage();
            updateCartBadge();
            document.getElementById('checkout-modal').classList.remove('open');
            window.showToast("Order simulated successfully! Bag cleared.");
            window.switchView('shop');
        }

function saveCartToStorage() {
            try {
                localStorage.setItem('verve_atelier_cart', JSON.stringify(state.cart));
            } catch (e) {}
        }

function loadCartFromStorage() {
            try {
                const saved = localStorage.getItem('verve_atelier_cart');
                if (saved) {
                    state.cart = JSON.parse(saved);
                }
            } catch (e) {
                state.cart = [];
            }
        }

export {
    toggleCartDrawer,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    applyPromoCode,
    renderCartDrawer,
    updateCartBadge,
    handleOpenCheckout,
    finishCheckoutProcess,
    saveCartToStorage,
    loadCartFromStorage
};
