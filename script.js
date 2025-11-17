// ========================================
// GESTION DES ÉLÉMENTS
// ========================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// ========================================
// MIGRATION ANCIEN SYSTÈME VERS MULTI-COMPTES
// ========================================
function migrateOldAccount() {
    const oldUserData = localStorage.getItem('userData');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (oldUserData && users.length === 0) {
        try {
            const oldUser = JSON.parse(oldUserData);
            
            const newUser = {
                id: Date.now(),
                role: 'client',
                nom: oldUser.nom,
                email: oldUser.email,
                telephone: oldUser.telephone || '',
                adresse: oldUser.adresse || '',
                codePostal: oldUser.codePostal || '',
                ville: oldUser.ville || '',
                password: oldUser.password
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            const oldOrders = localStorage.getItem('orders');
            if (oldOrders) {
                localStorage.setItem(`orders_${newUser.id}`, oldOrders);
            }
            
            localStorage.removeItem('userData');
            localStorage.removeItem('orders');
            
            console.log('✅ Ancien compte migré avec succès !');
            alert('✅ Votre compte a été mis à jour vers le nouveau système !');
            
            return newUser;
        } catch (error) {
            console.error('❌ Erreur lors de la migration:', error);
        }
    }
    
    return null;
}

// ========================================
// CHARGER LES PRODUITS
// ========================================
function loadProducts(category = 'all') {
    console.log('🔄 Chargement des produits...');
    
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

    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) menuToggle.style.display = 'block';

    loadProducts(category);
}

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

function filterAllProducts() {
    filterProducts('all');
}

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
// PANIER
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

    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✅ Ajouté !';
    button.style.background = '#4CAF50';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1500);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
    }
}

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
            <img src="${item.image || 'placeholder.jpg'}" 
                 alt="${item.name}" 
                 style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;"
                 onerror="this.src='placeholder.jpg'">
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

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

function checkout() {
    if (!currentUser) {
        alert('⚠️ Veuillez vous connecter ou créer un compte pour commander');
        showPage('connexion');
    } else {
        goToPayment();
    }
}

// ========================================
// PAIEMENT
// ========================================
function goToPayment() {
    if (cart.length === 0) {
        alert('⚠️ Votre panier est vide !');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('payment-items').innerHTML = cart.map(item => `
        <div class="payment-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)} €</span>
        </div>
    `).join('');
    
    document.getElementById('payment-total-amount').textContent = total.toFixed(2) + ' €';
    
    showPage('paiement');
}

function selectPaymentMethod(method) {
    document.querySelectorAll('input[name="payment"]').forEach(r => r.checked = false);
    
    document.getElementById('sumup-form').style.display = 'none';
    document.getElementById('paypal-form').style.display = 'none';
    
    if (method === 'sumup') {
        document.getElementById('payment-sumup').checked = true;
        document.getElementById('sumup-form').style.display = 'block';
    } else if (method === 'paypal') {
        document.getElementById('payment-paypal').checked = true;
        document.getElementById('paypal-form').style.display = 'block';
    }
}

function processSumUpPayment() {
    if (!confirm('🔄 Vous allez être redirigé vers SumUp. Continuer ?')) {
        return;
    }
    
    alert('💳 [MODE TEST] Paiement SumUp simulé avec succès !');
    finalizeOrder('SumUp');
}

function processPayPalPayment() {
    if (!confirm('🔄 Vous allez être redirigé vers PayPal. Continuer ?')) {
        return;
    }
    
    alert('💰 [MODE TEST] Paiement PayPal simulé avec succès !');
    finalizeOrder('PayPal');
}

function finalizeOrder(paymentMethod) {
    const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString('fr-FR'),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'Payée',
        paymentMethod: paymentMethod
    };
    
    let userOrders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];
    userOrders.push(order);
    localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(userOrders));
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    alert(`✅ Commande n°${order.id} validée avec succès !
    
Merci pour votre achat ! 🎉`);
    
    showPage('profil');
    showProfileSection('orders');
}

// ========================================
// CONNEXION / INSCRIPTION
// ========================================
function showAuthTab(tab) {
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

function login(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password && u.role === 'client');

    if (!user) {
        alert('❌ Email ou mot de passe incorrect');
        return;
    }

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    alert('✅ Connexion réussie !');

    document.getElementById('connexionBtn').style.display = 'none';
    document.getElementById('profilBtn').style.display = 'inline-block';
    document.getElementById('panierBtn').style.display = 'inline-block';

    showPage('boutique');
}

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

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.email === email)) {
        alert('❌ Un compte avec cet email existe déjà !');
        return;
    }

    const newUser = {
        id: Date.now(),
        role: 'client',
        nom,
        email,
        telephone,
        adresse,
        codePostal,
        ville,
        password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    alert('✅ Compte créé avec succès !');

    document.getElementById('connexionBtn').style.display = 'none';
    document.getElementById('profilBtn').style.display = 'inline-block';
    document.getElementById('panierBtn').style.display = 'inline-block';

    showPage('boutique');
}

// ========================================
// NAVIGATION
// ========================================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const pageElement = document.getElementById(pageId);
    if (pageElement) {
        pageElement.classList.add('active');
    }

    const menuToggle = document.getElementById('menuToggle');

    if (pageId === 'accueil') {
        if (menuToggle) menuToggle.style.display = 'none';
        document.getElementById('connexionBtn').style.display = 'inline-block';
        document.getElementById('profilBtn').style.display = 'none';
        document.getElementById('panierBtn').style.display = 'none';
    } else {
        if (currentUser) {
            document.getElementById('connexionBtn').style.display = 'none';
            document.getElementById('profilBtn').style.display = 'inline-block';
            document.getElementById('panierBtn').style.display = 'inline-block';
        } else {
            document.getElementById('connexionBtn').style.display = 'inline-block';
            document.getElementById('profilBtn').style.display = 'none';
            document.getElementById('panierBtn').style.display = 'inline-block';
        }

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
// PROFIL
// ========================================
function loadProfileData() {
    if (!currentUser) {
        alert('❌ Veuillez vous connecter');
        showPage('connexion');
        return;
    }

    document.getElementById('profileNom').value = currentUser.nom;
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profileTelephone').value = currentUser.telephone;
    document.getElementById('profileAdresse').value = currentUser.adresse;
    document.getElementById('profileCodePostal').value = currentUser.codePostal;
    document.getElementById('profileVille').value = currentUser.ville;

    loadOrders();
}

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

function loadOrders() {
    if (!currentUser) return;

    const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];
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
            ${order.paymentMethod ? `<p style="font-size: 22px; margin: 5px 0;"><strong>Paiement :</strong> ${order.paymentMethod}</p>` : ''}
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                ${order.items.map(item => `
                    <p style="font-size: 20px; color: #666;">• ${item.name} × ${item.quantity}</p>
                `).join('')}
            </div>
        </div>
    `).reverse().join('');
}

function updateProfile(event) {
    event.preventDefault();

    if (!currentUser) return;

    currentUser.nom = document.getElementById('profileNom').value;
    currentUser.email = document.getElementById('profileEmail').value;
    currentUser.telephone = document.getElementById('profileTelephone').value;
    currentUser.adresse = document.getElementById('profileAdresse').value;
    currentUser.codePostal = document.getElementById('profileCodePostal').value;
    currentUser.ville = document.getElementById('profileVille').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
        users[index] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    alert('✅ Informations mises à jour !');
}

function changePassword(event) {
    event.preventDefault();

    if (!currentUser) return;

    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (oldPassword !== currentUser.password) {
        alert('❌ Ancien mot de passe incorrect');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert('❌ Les nouveaux mots de passe ne correspondent pas');
        return;
    }

    currentUser.password = newPassword;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
        users[index] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    alert('✅ Mot de passe modifié !');
    document.getElementById('passwordForm').reset();
}

function deleteAccount() {
    if (!currentUser) return;

    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible !')) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.id !== currentUser.id);
        localStorage.setItem('users', JSON.stringify(users));
        
        localStorage.removeItem('currentUser');
        localStorage.removeItem(`orders_${currentUser.id}`);
        localStorage.removeItem('cart');
        
        currentUser = null;
        cart = [];
        updateCartCount();
        
        alert('✅ Votre compte a été supprimé.');
        showPage('accueil');
    }
}

// ========================================
// INITIALISATION
// ========================================
window.addEventListener('load', () => {
    const migratedUser = migrateOldAccount();
    
    if (migratedUser) {
        currentUser = migratedUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    updateCartCount();

    if (currentUser) {
        document.getElementById('connexionBtn').style.display = 'none';
        document.getElementById('profilBtn').style.display = 'inline-block';
        document.getElementById('panierBtn').style.display = 'inline-block';
    }
});
