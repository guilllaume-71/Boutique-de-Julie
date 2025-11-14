// ===== VARIABLES GLOBALES =====
let allProducts = {};
let cart = [];

// ===== CHARGER LES PRODUITS DEPUIS LE JSON =====
async function loadAllProducts() {
    try {
        const response = await fetch('data/products.json');
        allProducts = await response.json();
        console.log('✅ Produits chargés:', allProducts);
    } catch (error) {
        console.error('❌ Erreur chargement produits:', error);
    }
}

// ===== GESTION DU MENU =====
function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');

    menu.classList.toggle('open');
    overlay.classList.toggle('active');

    if (menu.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// ===== NAVIGATION =====
function showCategoryPage(pageId) {
    toggleMenu();
    showPage(pageId);
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');

        // Charger les produits selon la catégorie
        if (pageId === 'fondants') displayProducts('fondants');
        if (pageId === 'brules') displayProducts('brules');
        if (pageId === 'coffrets') displayProducts('coffrets');

        updateMenuButton(pageId);
    }
}

function updateMenuButton(pageId) {
    const menuToggle = document.getElementById('menuToggle');
    const categoryPages = ['fondants', 'brules', 'coffrets', 'peignes', 'bijoux', 'couronnes'];

    if (categoryPages.includes(pageId)) {
        menuToggle.classList.add('visible');
    } else {
        menuToggle.classList.remove('visible');
    }
}

// ===== AFFICHER LES PRODUITS =====
function displayProducts(category) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const products = allProducts[category] || [];

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-icon">${product.icon}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price.toFixed(2)} €</div>
            <div class="product-stock">Stock: ${product.stock}</div>
            <button class="btn-add-cart" onclick="addToCart(${product.id}, '${category}')">
                Ajouter au panier
            </button>
        `;
        grid.appendChild(card);
    });
}

// ===== RECHERCHE =====
function filterProducts() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    const searchTerm = input.value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const name = card.querySelector('.product-name').textContent.toLowerCase();
        card.style.display = name.includes(searchTerm) ? 'flex' : 'none';
    });
}

// ===== PANIER =====
function addToCart(productId, category) {
    const product = allProducts[category].find(p => p.id === productId);
    
    if (!product) {
        alert('❌ Produit introuvable');
        return;
    }

    if (product.stock <= 0) {
        alert('❌ Produit en rupture de stock');
        return;
    }

    // Vérifier si déjà dans le panier
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            category: category
        });
    }

    updateCartDisplay();
    alert(`✅ ${product.name} ajouté au panier !`);
}

function updateCartDisplay() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    console.log('🛒 Panier:', cart);
    console.log('📊 Total articles:', cartCount);
    // TODO: Mettre à jour l'icône panier
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', async function() {
    await loadAllProducts();
    showPage('accueil');
});
