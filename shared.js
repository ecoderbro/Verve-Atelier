const PRODUCTS_DATA = [
            {
                id: 1,
                name: "Classic Black Leather Jacket",
                category: "Leather Jackets",
                price: 320,
                description: "Handcrafted full-grain calfskin leather coat with a tailored asymmetrical zip and brushed gunmetal hardware.",
                image: "1.jpeg",
                material: "100% Full-Grain Calfskin Leather",
                fit: "Tailored Architectural Fit"
            },
            {
                id: 2,
                name: "Brown Vintage Leather Jacket",
                category: "Leather Jackets",
                price: 350,
                description: "Distressed antique finish brown leather jacket featuring plush shearling lining and reinforced elbow patches.",
                image: "2.jpeg",
                material: "Vegetable-Tanned Cowhide & Shearling",
                fit: "Vintage Relaxed Silhouette"
            },
            {
                id: 3,
                name: "Premium Biker Leather Jacket",
                category: "Leather Jackets",
                price: 390,
                description: "Heavyweight biker coat with padded shoulder stitching, custom silver zippers, and adjustable waist buckles.",
                image: "3.jpeg",
                material: "1.2mm Heavy Nappa Leather",
                fit: "Structured Rider Fit"
            },
            {
                id: 4,
                name: "Oversized Black T-Shirt",
                category: "T-Shirts",
                price: 55,
                description: "280 GSM heavyweight organic cotton tee with drop-shoulder relaxed boxy silhouette and dense collar ribbing.",
                image: "4.jpeg",
                material: "280 GSM 100% Organic Supima",
                fit: "Drop-Shoulder Boxy Fit"
            },
            {
                id: 5,
                name: "Essential White T-Shirt",
                category: "T-Shirts",
                price: 45,
                description: "Premium Supima cotton crewneck with a silky tactile feel and durable seamless double-stitched hem.",
                image: "5.jpeg",
                material: "200 GSM Supima Combed Cotton",
                fit: "Classic Regular Fit"
            },
            {
                id: 6,
                name: "Graphic Street T-Shirt",
                category: "T-Shirts",
                price: 60,
                description: "Limited edition minimalist typographic back print on vintage washed charcoal organic cotton.",
                image: "6.jpeg",
                material: "240 GSM Mineral Wash Cotton",
                fit: "Modern Oversized Fit"
            },
            {
                id: 7,
                name: "Relaxed Fit Cargo Shorts",
                category: "Shorts",
                price: 70,
                description: "Durable ripstop cotton cargo shorts featuring magnetic closure utility pockets and elastic drawstring waist.",
                image: "7.jpeg",
                material: "Tactical Cotton Ripstop Canvas",
                fit: "Relaxed Above-Knee Cut"
            },
            {
                id: 8,
                name: "Classic Denim Shorts",
                category: "Shorts",
                price: 65,
                description: "Vintage light wash rigid denim shorts with frayed raw hem tailoring and classic custom hardware.",
                image: "8.jpeg",
                material: "13.5 oz Raw Denim Cotton",
                fit: "Traditional 5-Pocket Straight Fit"
            },
            {
                id: 9,
                name: "Cotton Lounge Shorts",
                category: "Shorts",
                price: 50,
                description: "Ultra-soft French terry sweatshorts with metal-tipped drawstrings and breathable side slit seam pockets.",
                image: "9.jpeg",
                material: "350 GSM Loopback French Terry",
                fit: "Comfort Lounge Fit"
            },
            {
                id: 10,
                name: "Classic Check Pajama Set",
                category: "Pajamas",
                price: 85,
                description: "Yarn-dyed woven cotton check pajama top and pants set complete with ivory piping details and relaxed waist.",
                image: "10.jpeg",
                material: "Yarn-Dyed Woven Cotton",
                fit: "Relaxed Tailored Sleepwear Fit"
            },
            {
                id: 11,
                name: "Cotton Comfort Pajamas",
                category: "Pajamas",
                price: 80,
                description: "Breathable ribbed modal cotton lounge set engineered for night-long climate regulation and effortless movement.",
                image: "11.jpeg",
                material: "Ribbed Modal Organic Blend",
                fit: "Tactile Stretch Fit"
            },
            {
                id: 12,
                name: "Premium Satin Pajama Set",
                category: "Pajamas",
                price: 120,
                description: "Luxurious mulberry silk-blend satin button-up set with subtle tonal embroidery on the chest pocket.",
                image: "12.jpeg",
                material: "Mulberry Silk & Satin Blend",
                fit: "Fluid Drapery Fit"
            },
            {
                id: 13,
                name: "Oversized Black Hoodie",
                category: "Hoodies",
                price: 110,
                description: "450 GSM double-layer hood pullover with plush brushed fleece interior, seamless cuffing, and deep kangaroo pocket.",
                image: "13.jpeg",
                material: "450 GSM Heavy Fleece Cotton",
                fit: "Heavy Oversized Boxy Cut"
            },
            {
                id: 14,
                name: "Essential Grey Hoodie",
                category: "Hoodies",
                price: 95,
                description: "Heather grey loopback cotton hoodie designed for minimalist everyday layering and subtle metal drawstring tips.",
                image: "14.jpeg",
                material: "380 GSM Loopback Fleece",
                fit: "Standard Layering Fit"
            },
            {
                id: 15,
                name: "Streetwear Zip Hoodie",
                category: "Hoodies",
                price: 125,
                description: "Full-zip heavy fleece hoodie featuring custom two-way metal zipper hardware and dropped shoulder armholes.",
                image: "15.jpeg",
                material: "420 GSM Double-Faced Fleece",
                fit: "Streetwear Zip Silhouette"
            }
        ];

let state = {
            category: "All",
            searchQuery: "",
            maxPrice: 400,
            sortBy: "featured",
            cart: [],
            discountApplied: false,
            selectedQuickViewSize: "S",
            currentQuickViewId: null
        };

export { PRODUCTS_DATA, state };
