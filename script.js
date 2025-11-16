// ========================================
// GESTION DES ÉLÉMENTS
// ========================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

// ========================================
// CHARGER LES PRODUITS DEPUIS LOCALSTORAGE (ADMIN)
// ========================================
function loadProducts(category = 'all') {
    console.log('🔄 Chargement des produits...');
    
    // Charger depuis localStorage (les produits ajoutés depuis admin.html)
    const storedProducts = localStorage.getItem('products');
    
    if (storedProducts) {
        try {
            allProducts = JSON.parse(storedProducts);
            console.log('✅ Produits chargés:', allProducts.length);
            displayProducts(category);
        } catch (error) {
            console.error('❌ Erreur parsing JSON:', error);
            allProducts = [];
            displayNoProducts();
        }
    } else {
        console.warn('⚠️ Aucun produit trouvé dans localStorage');
        allProducts = [];
        displayNoProducts();
    }
}

// ========================================
// AFFICHER MESSAGE AUCUN PRODUIT
// ========================================
function displayNoProducts() {
    const containers = ['all-products-grid', 'fondants-grid', 'bruleparfums-grid', 'coffrets-grid', 'peignes-grid', 'bijoux-grid', 'couronnes-grid'];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #A38C7D;">
                    <p style="font-size: 28px;">⚠️ Aucun produit disponible</p>
                    <p style="font-size: 22px;">Ajoutez des produits depuis la page admin</p>
                </div>
            `;
        }
    });
}

// ========================================
// AFFICHER PRODUITS
// ========================================
function displayProducts(category = 'all') {
    console.log('📦 Affichage des produits, catégorie:', category);

    const containerMap = {
        'all': 'all-products-grid',
        'fondants': 'fondants-grid',
        'bruleparfums': 'bruleparfums-grid',
        'coffrets': 'coffrets-grid',
        'peignes': 'peignes-grid',
        'bijoux': 'bijoux-grid',
        'couronnes': 'couronnes-grid'
    };

    const containerId = containerMap[category] || 'all-products-grid';
    const container = document.getElementById(containerId);

    if (!container) {
        console.error('❌ Conteneur introuvable:', containerId);
        return;
    }

    let productsToDisplay = category === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === category);

    console.log('📊 Produits à afficher:', productsToDisplay.length);

    if (productsToDisplay.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #A38C7D;">
                <p style="font-size: 28px;">⚠️ Aucun produit dans cette catégorie</p>
            </div>
        `;
        return;
    }

    container.innerHTML = productsToDisplay.map(product => `
        <div class="product-card">
            <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" onerror="this.src='placeholder.jpg'">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description || ''}</p>
            <p class="product-price">${parseFloat(product.price).toFixed(2)} €</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                🛒 Ajouter au panier
            </button>
        </div>
    `).join('');
}

// ========================================
// AFFICHER UNE CATÉGORIE SPÉCIFIQUE
// ========================================
function showCategoryPage(category) {
    console.log('🔀 Changement de catégorie:', category);
    
    const menu = document.getElementById('sideMenu');
    if (menu) menu.classList.remove('open');

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const pageMap = {
        'all': 'all-products',
        'fondants': 'fondants',
        'bruleparfums': 'bruleparfums',
        'coffrets': 'coffrets',
        'peignes': 'peignes',
        'bijoux': 'bijoux',
        'couronnes': 'couronnes'
    };

    const pageToShow = pageMap[category] || 'all-products';
    const pageElement = document.getElementById(pageToShow);
    if (pageElement) {
        pageElement.classList.add('active');
    }

    // Afficher le menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) menuToggle.style.display = 'block';

    loadProducts(category);
}

// ========================================
// FILTRER LES PRODUITS (RECHERCHE)
// ========================================
function filterProducts(category) {
    const searchId = category === 'all' ? 'searchAllProducts' : `search${category.charAt(0).toUpperCase() + category.slice(1)}`;
    const searchInput = document.getElementById(searchId);
    
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    
    const filtered = allProducts.filter(p => {
        const matchCategory = category === 'all' || p.category === category;
        const matchSearch = p.name.toLowerCase().includes(searchTerm) || 
                          (p.description && p.description.toLowerCase().includes(searchTerm));
        return matchCategory && matchSearch;
    });

    const containerMap = {
        'all': 'all-products-grid',
        'fondants': 'fondants-grid',
        'bruleparfums': 'bruleparfums-grid',
        'coffrets': 'coffrets-grid',
        'peignes': 'peignes-grid',
        'bijoux': 'bijoux-grid',
        'couronnes': 'couronnes-grid'
    };

    const container = document.getElementById(containerMap[category]);
    
    if (!container) return;
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #A38C7D;">
                <p style="font-size: 24px;">Aucun résultat pour "${searchTerm}"</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(product => `
        <div class="product-card">
            <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" onerror="this.src='placeholder.jpg'">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description || ''}</p>
            <p class="product-price">${parseFloat(product.price).toFixed(2)} €</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                🛒 Ajouter au panier
            </button>
        </div>
    `).join('');
}

// Fonction spécifique pour "Tous les produits"
function filterAllProducts() {
    filterProducts('all');
}

// ========================================
// GESTION DU MENU COULISSANT
// ========================================
function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    if (menu) {
        menu.classList.toggle('open');
    }
}

document.addEventListener('click', function(event) {
    const menu = document.getElementById('sideMenu');
    const menuToggle = document.getElementById('menuToggle');
    
    if (menu && menuToggle) {
        if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
            menu.classList.remove('open');
        }
    }
});

// ========================================
// AJOUTER AU PANIER
// ========================================
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);

    if (!product) {
        alert('❌ Produit introuvable');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image || 'placeholder.jpg',
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Animation de confirmation
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✅ Ajouté !';
    button.style.background = '#4CAF50';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1500);
}

// ========================================
// METTRE À JOUR LE COMPTEUR PANIER
// ========================================
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
    }
}

// ========================================
// AFFICHER LE PANIER
// ========================================
function displayCart() {
    const container = document.getElementById('cartContainer');
    const summary = document.getElementById('cartSummary');

    if (!container || !summary) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px; color: #A38C7D;">
                <p style="font-size: 32px;">🛒</p>
                <p style="font-size: 28px;">Votre panier est vide</p>
                <button class="btn-enter" onclick="showPage('boutique')" style="margin-top: 30px;">
                    Continuer mes achats
                </button>
            </div>
        `;
        summary.innerHTML = '';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price.toFixed(2)} € × ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateQuantity(${item.id}, -1)" style="background: #A38C7D; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 20px;">-</button>
                <span style="margin: 0 15px; font-size: 22px; font-weight: bold;">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" style="background: #A38C7D; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 20px;">+</button>
                <button onclick="removeFromCart(${item.id})" style="background: #D32F2F; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-left: 20px; font-size: 20px;">🗑️</button>
            </div>
        </div>
    `).join('');

    summary.innerHTML = `
        <h3 style="color: #A38C7D; font-size: 32px; margin-bottom: 20px;">Récapitulatif</h3>
        <p style="font-size: 28px; margin-bottom: 30px;">Total : <strong>${total.toFixed(2)} €</strong></p>
        <button class="btn-enter" onclick="checkout()">Passer la commande</button>
    `;
}

// ========================================
// MODIFIER QUANTITÉ
// ========================================
function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// ========================================
// SUPPRIMER DU PANIER
// ========================================
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// ========================================
// PASSER LA COMMANDE
// ========================================
function checkout() {
    const userData = localStorage.getItem('userData');

    if (!userData) {
        alert('⚠️ Veuillez vous connecter ou créer un compte pour commander');
        showPage('connexion');
    } else {
        alert('✅ Commande validée ! (Fonctionnalité de paiement à venir)');
        
        // Créer la commande
        const order = {
            id: Date.now(),
            date: new Date().toLocaleDateString('fr-FR'),
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'En cours'
        };
        
        // Sauvegarder la commande
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Vider le panier
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCart();
    }
}

// ========================================
// GESTION ONGLETS CONNEXION/INSCRIPTION
// ========================================
function showAuthTab(tab) {
    // Gérer les onglets
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelectorAll('.auth-tab')[0].classList.add('active');
        document.getElementById('login-form').classList.add('active');
    } else {
        document.querySelectorAll('.auth-tab')[1].classList.add('active');
        document.getElementById('register-form').classList.add('active');
    }
}

// ========================================
// CONNEXION
// ========================================
function login(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
        alert('❌ Aucun compte trouvé. Veuillez créer un compte.');
        showAuthTab('register');
        return;
    }

    if (userData.email === email && userData.password === password) {
        alert('✅ Connexion réussie !');

        document.getElementById('connexionBtn').style.display = 'none';
        document.getElementById('profilBtn').style.display = 'inline-block';
        document.getElementById('panierBtn').style.display = 'inline-block';

        showPage('boutique');
    } else {
        alert('❌ Email ou mot de passe incorrect');
    }
}

// ========================================
// CRÉER UN COMPTE
// ========================================
function createAccount(event) {
    event.preventDefault();

    const nom = document.getElementById('regNom').value;
    const email = document.getElementById('regEmail').value;
    const telephone = document.getElementById('regTelephone').value;
    const adresse = document.getElementById('regAdresse').value;
    const codePostal = document.getElementById('regCodePostal').value;
    const ville = document.getElementById('regVille').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('❌ Les mots de passe ne correspondent pas !');
        return;
    }

    const userData = {
        nom, email, telephone, adresse, codePostal, ville, password
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    alert('✅ Compte créé avec succès !');

    document.getElementById('connexionBtn').style.display = 'none';
    document.getElementById('profilBtn').style.display = 'inline-block';
    document.getElementById('panierBtn').style.display = 'inline-block';

    showPage('boutique');
}

// ========================================
// NAVIGATION ENTRE PAGES
// ========================================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const pageElement = document.getElementById(pageId);
    if (pageElement) {
        pageElement.classList.add('active');
    }

    const userData = localStorage.getItem('userData');
    const menuToggle = document.getElementById('menuToggle');

    // Gérer l'affichage des boutons selon la page
    if (pageId === 'accueil') {
        if (menuToggle) menuToggle.style.display = 'none';
        document.getElementById('connexionBtn').style.display = 'inline-block';
        document.getElementById('profilBtn').style.display = 'none';
        document.getElementById('panierBtn').style.display = 'none';
    } else {
        // Afficher boutons selon connexion
        if (userData) {
            document.getElementById('connexionBtn').style.display = 'none';
            document.getElementById('profilBtn').style.display = 'inline-block';
            document.getElementById('panierBtn').style.display = 'inline-block';
        } else {
            document.getElementById('connexionBtn').style.display = 'inline-block';
            document.getElementById('profilBtn').style.display = 'none';
            document.getElementById('panierBtn').style.display = 'inline-block';
        }

        // Masquer le menu sur la page panier
        if (pageId === 'panier') {
            if (menuToggle) menuToggle.style.display = 'none';
            displayCart();
        } else if (['boutique', 'fondants', 'bruleparfums', 'coffrets', 'peignes', 'bijoux', 'couronnes', 'all-products'].includes(pageId)) {
            if (menuToggle) menuToggle.style.display = 'block';
        } else {
            if (menuToggle) menuToggle.style.display = 'none';
        }
    }

    if (pageId === 'profil') {
        loadProfileData();
    }

    if (pageId === 'boutique') {
        loadProducts('all');
    }
}

// ========================================
// CHARGER DONNÉES PROFIL
// ========================================
function loadProfileData() {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
        alert('❌ Veuillez vous connecter');
        showPage('connexion');
        return;
    }

    document.getElementById('profileNom').value = userData.nom;
    document.getElementById('profileEmail').value = userData.email;
    document.getElementById('profileTelephone').value = userData.telephone;
    document.getElementById('profileAdresse').value = userData.adresse;
    document.getElementById('profileCodePostal').value = userData.codePostal;
    document.getElementById('profileVille').value = userData.ville;

    loadOrders();
}

// ========================================
// AFFICHER SECTIONS PROFIL
// ========================================
function showProfileSection(section) {
    document.querySelectorAll('.profile-section').forEach(s => {
        s.classList.remove('active');
    });

    document.querySelectorAll('.profile-tab').forEach(t => {
        t.classList.remove('active');
    });

    const sectionMap = {
        'infos': 'profileInfos',
        'orders': 'profileOrders',
        'security': 'profileSecurity',
        'delete': 'profileDelete'
    };

    document.getElementById(sectionMap[section]).classList.add('active');
    event.target.classList.add('active');

    if (section === 'orders') {
        loadOrders();
    }
}

// ========================================
// CHARGER COMMANDES
// ========================================
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const container = document.getElementById('ordersContainer');

    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #A38C7D;">
                <p style="font-size: 28px;">📦</p>
                <p style="font-size: 24px;">Aucune commande pour le moment</p>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card" style="background: white; border: 2px solid #A38C7D; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h4 style="color: #A38C7D; font-size: 26px;">Commande #${order.id}</h4>
                <span style="background: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px; font-size: 20px;">${order.status}</span>
            </div>
            <p style="font-size: 22px; margin: 5px 0;"><strong>Date :</strong> ${order.date}</p>
            <p style="font-size: 22px; margin: 5px 0;"><strong>Total :</strong> ${order.total.toFixed(2)} €</p>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                ${order.items.map(item => `
                    <p style="font-size: 20px; color: #666;">• ${item.name} × ${item.quantity}</p>
                `).join('')}
            </div>
        </div>
    `).reverse().join('');
}

// ========================================
// METTRE À JOUR PROFIL
// ========================================
function updateProfile(event) {
    event.preventDefault();

    const userData = {
        nom: document.getElementById('profileNom').value,
        email: document.getElementById('profileEmail').value,
        telephone: document.getElementById('profileTelephone').value,
        adresse: document.getElementById('profileAdresse').value,
        codePostal: document.getElementById('profileCodePostal').value,
        ville: document.getElementById('profileVille').value,
        password: JSON.parse(localStorage.getItem('userData')).password
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    alert('✅ Informations mises à jour !');
}

// ========================================
// CHANGER MOT DE PASSE
// ========================================
function changePassword(event) {
    event.preventDefault();

    const userData = JSON.parse(localStorage.getItem('userData'));
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (oldPassword !== userData.password) {
        alert('❌ Ancien mot de passe incorrect');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert('❌ Les nouveaux mots de passe ne correspondent pas');
        return;
    }

    userData.password = newPassword;
    localStorage.setItem('userData', JSON.stringify(userData));
    alert('✅ Mot de passe modifié !');
    document.getElementById('passwordForm').reset();
}

// ========================================
// SUPPRIMER COMPTE
// ========================================
function deleteAccount() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible !')) {
        localStorage.removeItem('userData');
        localStorage.removeItem('cart');
        localStorage.removeItem('orders');
        cart = [];
        updateCartCount();
        alert('✅ Votre compte a été supprimé.');
        showPage('accueil');
    }
}

// ========================================
// INITIALISATION AU CHARGEMENT
// ========================================
window.addEventListener('load', () => {
    updateCartCount();

    const userData = localStorage.getItem('userData');
    if (userData) {
        document.getElementById('connexionBtn').style.display = 'none';
        document.getElementById('profilBtn').style.display = 'inline-block';
        document.getElementById('panierBtn').style.display = 'inline-block';
    }
});
