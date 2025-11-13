// FONDANTS PARFUMÉS (LES 28)
const fondants = [
    { name: "Cerise noire explosive", icon: "🍒", price: "3,50 €" },
    { name: "Citrouille vanillée", icon: "🎃", price: "3,50 €" },
    { name: "Linge propre", icon: "🧺", price: "3,50 €" },
    { name: "Fleurs d'oranger", icon: "🌸", price: "3,50 €" },
    { name: "Lait d'amande", icon: "🥛", price: "3,50 €" },
    { name: "Délice interdit", icon: "🍫", price: "3,50 €" },
    { name: "Brioche au beurre", icon: "🥐", price: "3,50 €" },
    { name: "Licorne", icon: "🦄", price: "3,50 €" },
    { name: "Délice gourmand", icon: "🍰", price: "3,50 €" },
    { name: "Cuberdon", icon: "🍬", price: "3,50 €" },
    { name: "L'heure des sorcières", icon: "🧙", price: "3,50 €" },
    { name: "Barbe à papa", icon: "🍭", price: "3,50 €" },
    { name: "Sorbet à la fraise", icon: "🍓", price: "3,50 €" },
    { name: "Cappuccino crémeux", icon: "☕", price: "3,50 €" },
    { name: "Miel & lait", icon: "🍯", price: "3,50 €" },
    { name: "Réglisse", icon: "🖤", price: "3,50 €" },
    { name: "Thé vert matcha", icon: "🍵", price: "3,50 €" },
    { name: "Violette", icon: "💜", price: "3,50 €" },
    { name: "Cookies noisette", icon: "🍪", price: "3,50 €" },
    { name: "Framboise", icon: "🫐", price: "3,50 €" },
    { name: "Coco & monoï", icon: "🥥", price: "3,50 €" },
    { name: "Ananas & coco", icon: "🍍", price: "3,50 €" },
    { name: "Eucalyptus frais", icon: "🌿", price: "3,50 €" },
    { name: "Muguet des bois", icon: "🔔", price: "3,50 €" },
    { name: "Pêche & abricot", icon: "🍑", price: "3,50 €" },
    { name: "Caramel au beurre salé", icon: "🍮", price: "3,50 €" },
    { name: "Rose & pivoine", icon: "🌹", price: "3,50 €" },
    { name: "Lavande de Provence", icon: "🪻", price: "3,50 €" }
];

// GESTION DU MENU COULISSANT
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

// NAVIGATION VERS UNE CATÉGORIE (FERME LE MENU)
function showCategoryPage(pageId) {
    toggleMenu(); // Ferme le menu
    showPage(pageId); // Affiche la page
}

// NAVIGATION GÉNÉRALE
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Charger les produits si page fondants
        if (pageId === 'fondants') {
            loadProducts();
        }
        
        // Afficher/Masquer le bouton catégories
        updateMenuButton(pageId);
    }
}

// AFFICHAGE DU BOUTON CATÉGORIES
function updateMenuButton(pageId) {
    const menuToggle = document.getElementById('menuToggle');
    const categoryPages = ['fondants', 'brules', 'coffrets', 'peignes', 'bijoux', 'couronnes'];
    
    if (categoryPages.includes(pageId)) {
        menuToggle.classList.add('visible');
    } else {
        menuToggle.classList.remove('visible');
    }
}

// CHARGER LES PRODUITS FONDANTS
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    fondants.forEach(fondant => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-icon">${fondant.icon}</div>
            <div class="product-name">${fondant.name}</div>
            <div class="product-price">${fondant.price}</div>
            <button class="btn-add-cart" onclick="addToCart('${fondant.name}')">Ajouter au panier</button>
        `;
        grid.appendChild(card);
    });
}

// RECHERCHE
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

// AJOUTER AU PANIER
function addToCart(productName) {
    alert(`✅ ${productName} ajouté au panier !`);
}

// INITIALISATION
document.addEventListener('DOMContentLoaded', function() {
    showPage('accueil');
});
