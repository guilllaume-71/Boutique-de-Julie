// ========================================
// CONFIGURATION ADMIN
// ========================================
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

let products = [];
let editingProductId = null;
let productToDelete = null;
let clientToDelete = null;
let cachedUsers = [];
let allOrders = [];
let allMessages = [];
let orderToDelete = null;
let messageToDelete = null;
let syncInterval = null;
let editingOrderId = null;

// ========================================
// SYSTÈME DE TOASTS DISCRET
// ========================================
function initToastContainer() {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'success', duration = 3000) {
    initToastContainer();
    
    const toast = document.createElement('div');
    
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    
    const colors = {
        'success': '#4CAF50',
        'error': '#f44336',
        'warning': '#ff9800',
        'info': '#2196F3'
    };
    
    toast.style.cssText = `
        background: white;
        color: #333;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-weight: 500;
        min-width: 300px;
        max-width: 500px;
        border-left: 4px solid ${colors[type]};
        animation: slideIn 0.3s ease-out;
        pointer-events: auto;
        cursor: pointer;
    `;
    
    toast.innerHTML = `
        <span style="font-size: 20px;">${icons[type]}</span>
        <span style="flex: 1;">${message}</span>
        <span style="opacity: 0.5; font-size: 18px; cursor: pointer;" onclick="this.parentElement.remove()">×</span>
    `;
    
    if (!document.getElementById('toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    const container = document.getElementById('toast-container');
    container.appendChild(toast);
    
    toast.onclick = () => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    };
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
}

function confirmAction(message, onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999998;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.2s ease;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        max-width: 400px;
        text-align: center;
        animation: scaleIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
        <p style="font-size: 16px; margin-bottom: 30px; color: #333;">${message}</p>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="confirm-yes" style="
                padding: 12px 24px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
            ">✅ Oui</button>
            <button id="confirm-no" style="
                padding: 12px 24px;
                background: #f44336;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
            ">❌ Non</button>
        </div>
    `;
    
    if (!document.getElementById('modal-animations')) {
        const style = document.createElement('style');
        style.id = 'modal-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('confirm-yes').onclick = () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    };
    
    document.getElementById('confirm-no').onclick = () => {
        overlay.remove();
        if (onCancel) onCancel();
    };
    
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (onCancel) onCancel();
        }
    };
}

// ========================================
// CONNEXION
// ========================================
function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        showToast('Connexion réussie ! 🎉', 'success');
        showAdminPanel();
    } else {
        showToast('Identifiants incorrects', 'error');
    }
    
    return false;
}

// ========================================
// DÉCONNEXION
// ========================================
function deconnexion() {
    confirmAction('Voulez-vous vraiment vous déconnecter ?', () => {
        localStorage.removeItem('adminLoggedIn');
        hideAdminPanel();
        showToast('Déconnexion réussie', 'info');
    });
}

// ========================================
// VÉRIFIER AUTHENTIFICATION
// ========================================
function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        showAdminPanel();
    } else {
        hideAdminPanel();
    }
}

// ========================================
// AFFICHER/MASQUER PANNEAUX
// ========================================
function showAdminPanel() {
    const loginSection = document.getElementById('login-section');
    const adminPanel = document.getElementById('admin-zone');
    
    if (loginSection) loginSection.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';
    
    loadProducts();
    loadUsersCache();
    loadClients();
    loadOrders();
    loadMessages();
}

function hideAdminPanel() {
    const loginSection = document.getElementById('login-section');
    const adminPanel = document.getElementById('admin-zone');
    
    if (loginSection) loginSection.style.display = 'flex';
    if (adminPanel) adminPanel.style.display = 'none';
}

// ========================================
// GESTION DES ONGLETS
// ========================================
function showTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    const selectedTab = document.getElementById('tab-' + tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    if (window.event && window.event.target) {
        window.event.target.classList.add('active');
    }
    
    switch(tabName) {
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'messages':
            loadMessages();
            break;
        case 'clients':
            loadClients();
            break;
    }
}

// ========================================
// CHARGER PRODUITS
// ========================================
function loadProducts() {
    fetch('api/get-products.php')
        .then(response => response.json())
        .then(data => {
            products = data.products || [];
            displayProducts();
            updateStats();
        })
        .catch(error => {
            console.error('Erreur chargement produits:', error);
            products = [];
            displayProducts();
        });
}

// ========================================
// SAUVEGARDER PRODUITS DANS API
// ========================================
function saveProductsToAPI() {
    return fetch('api/save-products.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({products: products})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Produits sauvegardés');
            return true;
        } else {
            console.error('❌ Erreur sauvegarde:', data.message);
            return false;
        }
    })
    .catch(error => {
        console.error('❌ Erreur réseau:', error);
        return false;
    });
}

// ========================================
// AFFICHER PRODUITS
// ========================================
function displayProducts() {
    const tbody = document.getElementById('products-list');
    if (!tbody) return;

    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                    Aucun produit disponible
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.image || 'https://via.placeholder.com/50x50/F5E6D3/8B7355?text=Pas+d%27image'}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" onerror="this.src='https://via.placeholder.com/50x50/F5E6D3/8B7355?text=Erreur'"></td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>${parseFloat(product.price).toFixed(2)} €</td>
            <td>${product.stock || 0}</td>
            <td>
                <button onclick="editProduct(${product.id})" class="btn-edit">✏️</button>
                <button onclick="openDeleteModal(${product.id})" class="btn-delete">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ========================================
// NOM DE CATÉGORIE
// ========================================
function getCategoryName(category) {
    const categories = {
        'fondants': '🌸 Fondants',
        'bruleparfums': '🕯️ Brûle-parfums',
        'coffrets': '🎁 Coffrets',
        'peignes': '💐 Peignes',
        'bijoux': '💍 Bijoux',
        'couronnes': '👑 Couronnes'
    };
    return categories[category] || category;
}

// ========================================
// STATISTIQUES
// ========================================
function updateStats() {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * (p.stock || 0)), 0);
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStock = products.filter(p => (p.stock || 0) < 5).length;

    const totalProductsEl = document.getElementById('total-products');
    const totalValueEl = document.getElementById('total-value');
    const totalStockEl = document.getElementById('total-stock');
    const lowStockEl = document.getElementById('low-stock');
    const totalOrdersEl = document.getElementById('total-orders');
    const totalClientsEl = document.getElementById('total-clients');

    if (totalProductsEl) totalProductsEl.textContent = totalProducts;
    if (totalValueEl) totalValueEl.textContent = totalValue.toFixed(2) + ' €';
    if (totalStockEl) totalStockEl.textContent = totalStock;
    if (lowStockEl) lowStockEl.textContent = lowStock;
    if (totalOrdersEl) totalOrdersEl.textContent = allOrders.length;
    if (totalClientsEl) totalClientsEl.textContent = cachedUsers.filter(u => u.role === 'client').length;
}

// ========================================
// RECHERCHE PRODUITS
// ========================================
function searchProducts() {
    const searchInput = document.getElementById('search-product');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    const tbody = document.getElementById('products-list');
    if (!tbody) return;

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                    Aucun résultat pour "${searchTerm}"
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.image || 'https://via.placeholder.com/50x50/F5E6D3/8B7355?text=Pas+d%27image'}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>${parseFloat(product.price).toFixed(2)} €</td>
            <td>${product.stock || 0}</td>
            <td>
                <button onclick="editProduct(${product.id})" class="btn-edit">✏️</button>
                <button onclick="openDeleteModal(${product.id})" class="btn-delete">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ========================================
// GESTION CLIENTS
// ========================================
function loadClients() {
    fetch('api/get-users.php')
        .then(response => response.json())
        .then(data => {
            const users = data.users || [];
            const clients = users.filter(u => u.role === 'client');
            displayClients(clients);
            updateClientsStats(clients.length);
        })
        .catch(error => {
            console.error('Erreur chargement clients:', error);
            displayClients([]);
        });
}

function displayClients(clientsList = null) {
    const tbody = document.getElementById('clients-list');
    if (!tbody) return;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const clients = clientsList || users.filter(u => u.role === 'client');

    if (clients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                    Aucun client enregistré
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = clients.map(client => {
        const clientOrders = allOrders.filter(o => o.userId === client.id);
        return `
            <tr>
                <td>${client.id}</td>
                <td>${client.nom}</td>
                <td>${client.email}</td>
                <td>${client.telephone || '-'}</td>
                <td>${client.ville || '-'}</td>
                <td>${clientOrders.length}</td>
                <td>
                    <button onclick="viewClientDetails(${client.id})" class="btn-edit" title="Voir détails">👁️</button>
                    <button onclick="openDeleteClientModal(${client.id})" class="btn-delete" title="Supprimer">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

function searchClients() {
    const searchInput = document.getElementById('search-client');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    
    fetch('api/get-users.php')
        .then(response => response.json())
        .then(data => {
            const users = data.users || [];
            const clients = users.filter(u => u.role === 'client');
            
            const filtered = clients.filter(c => 
                c.nom.toLowerCase().includes(searchTerm) ||
                c.email.toLowerCase().includes(searchTerm) ||
                (c.ville && c.ville.toLowerCase().includes(searchTerm))
            );

            displayClients(filtered);
        });
}

function viewClientDetails(clientId) {
    fetch('api/get-users.php')
        .then(response => response.json())
        .then(data => {
            const users = data.users || [];
            const client = users.find(u => u.id === clientId);
            
            if (!client) return;

            const clientOrders = allOrders.filter(o => o.userId === clientId);
            const totalSpent = clientOrders.reduce((sum, order) => sum + order.total, 0);

            const detailsHtml = `
                <div style="padding: 20px;">
                    <h4 style="color: #A38C7D; margin-bottom: 20px;">Informations personnelles</h4>
                    <p><strong>Nom :</strong> ${client.nom}</p>
                    <p><strong>Email :</strong> ${client.email}</p>
                    <p><strong>Téléphone :</strong> ${client.telephone || 'Non renseigné'}</p>
                    <p><strong>Adresse :</strong> ${client.adresse || 'Non renseignée'}</p>
                    <p><strong>Code postal :</strong> ${client.codePostal || '-'}</p>
                    <p><strong>Ville :</strong> ${client.ville || 'Non renseignée'}</p>
                    
                    <h4 style="color: #A38C7D; margin: 30px 0 20px 0;">Historique des commandes (${clientOrders.length})</h4>
                    <p><strong>Total dépensé :</strong> ${totalSpent.toFixed(2)} €</p>
                    
                    ${clientOrders.length > 0 ? `
                        <div style="max-height: 300px; overflow-y: auto; margin-top: 15px;">
                            ${clientOrders.map(order => `
                                <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
                                    <p><strong>Commande #${order.id}</strong></p>
                                    <p>Date : ${order.date}</p>
                                    <p>Total : ${order.total.toFixed(2)} €</p>
                                    <p>Statut : <span style="background: #4CAF50; color: white; padding: 2px 10px; border-radius: 10px;">${order.status}</span></p>
                                    <details>
                                        <summary style="cursor: pointer; color: #A38C7D;">Voir les produits</summary>
                                        <ul style="margin-top: 10px;">
                                            ${order.items.map(item => `
                                                <li>${item.name} × ${item.quantity} - ${(item.price * item.quantity).toFixed(2)} €</li>
                                            `).join('')}
                                        </ul>
                                    </details>
                                </div>
                            `).reverse().join('')}
                        </div>
                    ` : '<p style="color: #999;">Aucune commande</p>'}
                </div>
            `;

            document.getElementById('client-details').innerHTML = detailsHtml;
            document.getElementById('client-modal').style.display = 'flex';
        });
}

function closeClientModal() {
    document.getElementById('client-modal').style.display = 'none';
}

function openDeleteClientModal(clientId) {
    clientToDelete = clientId;
    document.getElementById('delete-client-modal').style.display = 'flex';
}

function closeDeleteClientModal() {
    clientToDelete = null;
    document.getElementById('delete-client-modal').style.display = 'none';
}

function confirmDeleteClient() {
    if (!clientToDelete) return;
    
    fetch('api/get-users.php')
        .then(response => response.json())
        .then(data => {
            let users = data.users || [];
            users = users.filter(u => u.id !== clientToDelete);
            
            return fetch('api/save-users.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({users: users})
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Client supprimé avec succès ! 🗑️', 'success');
                loadClients();
                updateStats();
                closeDeleteClientModal();
            } else {
                showToast('Erreur lors de la suppression', 'error');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            showToast('Erreur lors de la suppression', 'error');
        });
}

// ========================================
// AJOUTER/MODIFIER PRODUIT
// ========================================
function submitProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const description = document.getElementById('product-description').value;
    const imageUrl = document.getElementById('product-image').value;
    const fileInput = document.getElementById('file-input');
    
    // Récupérer les allergènes
    const allergensInput = document.getElementById('product-allergens');
    const allergens = allergensInput ? allergensInput.value.split(',').map(a => a.trim()).filter(a => a) : [];
    
    // Récupérer les options de personnalisation
    const customizable = document.getElementById('product-customizable') ? document.getElementById('product-customizable').checked : false;
    
    if (editingProductId) {
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                category,
                price,
                stock,
                description,
                allergens,
                customizable
            };
            
            if (fileInput && fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    products[index].image = e.target.result;
                    saveProductsToAPI();
                    loadProducts();
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else if (imageUrl) {
                products[index].image = imageUrl;
                saveProductsToAPI();
                loadProducts();
            } else {
                saveProductsToAPI();
                loadProducts();
            }
            
            showToast('Produit modifié avec succès ! ✏️', 'success');
            cancelEdit();
        }
    } else {
        const newProduct = {
            id: Date.now(),
            name,
            category,
            price,
            stock,
            description,
            allergens,
            customizable,
            image: ''
        };
        
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                newProduct.image = e.target.result;
                products.push(newProduct);
                saveProductsToAPI();
                loadProducts();
                showToast('Produit ajouté avec succès ! ✅', 'success');
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else if (imageUrl) {
            newProduct.image = imageUrl;
            products.push(newProduct);
            saveProductsToAPI();
            loadProducts();
            showToast('Produit ajouté avec succès ! ✅', 'success');
        } else {
            products.push(newProduct);
            saveProductsToAPI();
            loadProducts();
            showToast('Produit ajouté avec succès ! ✅', 'success');
        }
        
        document.getElementById('product-form').reset();
        const preview = document.getElementById('image-preview');
        if (preview) preview.style.display = 'none';
    }
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    editingProductId = id;
    
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-description').value = product.description || '';
    
    if (product.image) {
        document.getElementById('product-image').value = product.image;
        const preview = document.getElementById('image-preview');
        const previewImg = document.getElementById('preview-img');
        if (preview && previewImg) {
            preview.style.display = 'block';
            previewImg.src = product.image;
        }
    }
    
    document.getElementById('form-title').textContent = '✏️ Modifier le Produit';
    showTab('add');
}

function cancelEdit() {
    editingProductId = null;
    document.getElementById('product-form').reset();
    document.getElementById('form-title').textContent = '➕ Ajouter un Produit';
    
    const preview = document.getElementById('image-preview');
    if (preview) preview.style.display = 'none';
}

// ========================================
// SUPPRIMER PRODUIT
// ========================================
function openDeleteModal(id) {
    productToDelete = id;
    const modal = document.getElementById('delete-modal');
    if (modal) modal.style.display = 'flex';
}

function closeDeleteModal() {
    productToDelete = null;
    const modal = document.getElementById('delete-modal');
    if (modal) modal.style.display = 'none';
}

function confirmDelete() {
    if (!productToDelete) return;
    
    products = products.filter(p => p.id !== productToDelete);
    saveProductsToAPI();
    
    loadProducts();
    closeDeleteModal();
    
    showToast('Produit supprimé avec succès ! 🗑️', 'success');
}

// ========================================
// GESTION UPLOAD IMAGE
// ========================================
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('image-preview');
            const previewImg = document.getElementById('preview-img');
            
            if (preview && previewImg) {
                preview.style.display = 'block';
                previewImg.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
}

function removeImage() {
    document.getElementById('product-image').value = '';
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
    
    const preview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    
    if (preview) preview.style.display = 'none';
    if (previewImg) previewImg.src = '';
}

// ========================================
// GESTION DES COMMANDES
// ========================================
async function loadUsersCache() {
    try {
        const response = await fetch('api/get-users.php');
        const data = await response.json();
        cachedUsers = data.users || [];
        console.log('👥 Users chargés:', cachedUsers.length);
    } catch (error) {
        console.error('Erreur chargement users:', error);
        cachedUsers = [];
    }
}

function getUserName(userId) {
    const user = cachedUsers.find(u => u.id === userId);
    return user ? user.nom : 'Client inconnu';
}

function loadOrders() {
    console.log('🔄 Chargement des commandes...');
    fetch('api/get-orders.php')
        .then(response => {
            console.log('📥 Réponse API reçue:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('📦 Données commandes:', data);
            allOrders = data.orders || [];
            console.log('📊 Nombre de commandes:', allOrders.length);
            displayOrders();
            updateOrdersStats();
        })
        .catch(error => {
            console.error('❌ Erreur chargement commandes:', error);
            allOrders = [];
        });
}

function displayOrders() {
    const tbody = document.getElementById('orders-list');
    if (!tbody) return;

    if (allOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:40px; color:#A38C7D;">📦 Aucune commande</td></tr>';
        return;
    }

    tbody.innerHTML = allOrders.map(order => `
        <tr>
            <td><strong>#${order.id}</strong></td>
            <td>${order.date || 'N/A'}</td>
            <td>${getUserName(order.userId) || 'Inconnu'}</td>
            <td>${order.items ? order.items.length : 0} produit(s)</td>
            <td><strong>${order.total ? order.total.toFixed(2) : '0.00'} €</strong></td>
            <td><span class="badge-stock en-stock">${order.status || 'En cours'}</span></td>
            <td>${order.paymentMethod || 'N/A'}</td>
            <td style="font-size: 12px;">${order.trackingNumber || '-'}</td>
            <td>
                <div class="action-btns">
                    <button onclick="showOrderDetails(${order.id})" class="btn-edit" title="Voir">👁️</button>
                    <button onclick="generateInvoice(${order.id})" class="btn-edit" style="background: #2196F3;" title="Facture">📄</button>
                    <button onclick="editOrderTracking(${order.id})" class="btn-edit" style="background: #FF9800;" title="Suivi">📦</button>
                    <button onclick="openDeleteOrderModal(${order.id})" class="btn-delete" title="Supprimer">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showOrderDetails(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    const userName = getUserName(order.userId);
    const itemsList = order.items ? order.items.map(item => `
        <p style="margin: 5px 0; padding: 10px; background: #f8f0f0; border-radius: 5px;">
            <strong>${item.name}</strong> × ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} €
            ${item.customization ? `
                <br><small style="color: #666;">
                    ${item.customization.text ? `💬 ${item.customization.text}` : ''}
                    ${item.customization.flowers ? `<br>🌸 ${item.customization.flowers.join(', ')}` : ''}
                </small>
            ` : ''}
        </p>
    `).join('') : '<p>Aucun produit</p>';

    const details = `
        <div style="text-align: left;">
            <p><strong>📦 Commande #${order.id}</strong></p>
            <p><strong>📅 Date :</strong> ${order.date}</p>
            <p><strong>👤 Client :</strong> ${userName}</p>
            <p><strong>💳 Paiement :</strong> ${order.paymentMethod || 'N/A'}</p>
            <p><strong>📋 Statut :</strong> ${order.status || 'En cours'}</p>
            ${order.shippingMethod ? `<p><strong>🚚 Livraison :</strong> ${order.shippingMethod}</p>` : ''}
            ${order.trackingNumber ? `<p><strong>📦 N° Suivi :</strong> ${order.trackingNumber}</p>` : ''}
            <hr style="margin: 15px 0;">
            <p><strong>🛍️ Produits :</strong></p>
            ${itemsList}
            <hr style="margin: 15px 0;">
            <p style="font-size: 20px;"><strong>💰 Total : ${order.total ? order.total.toFixed(2) : '0.00'} €</strong></p>
        </div>
    `;

    document.getElementById('client-details').innerHTML = details;
    document.getElementById('client-modal').classList.add('show');
    document.getElementById('client-modal').style.display = 'flex';
}

// ========================================
// GÉNÉRATION DE FACTURE PDF
// ========================================
function generateInvoice(orderId) {
    showToast('Génération de la facture...', 'info');
    
    // Ouvrir la facture dans un nouvel onglet
    window.open(`api/generate-invoice.php?orderId=${orderId}`, '_blank');
    
    setTimeout(() => {
        showToast('Facture générée ! 📄', 'success');
    }, 1000);
}

// ========================================
// GESTION DU SUIVI DE COMMANDE
// ========================================
function editOrderTracking(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    editingOrderId = orderId;

    const trackingHTML = `
        <div style="padding: 20px;">
            <h4 style="color: #A38C7D; margin-bottom: 20px;">📦 Gestion du suivi - Commande #${order.id}</h4>
            
            <form id="tracking-form" onsubmit="saveOrderTracking(event)">
                <div class="form-group">
                    <label><strong>Statut de la commande :</strong></label>
                    <select id="order-status" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px;">
                        <option value="En préparation" ${order.status === 'En préparation' ? 'selected' : ''}>En préparation</option>
                        <option value="Expédiée" ${order.status === 'Expédiée' ? 'selected' : ''}>Expédiée</option>
                        <option value="En transit" ${order.status === 'En transit' ? 'selected' : ''}>En transit</option>
                        <option value="Livrée" ${order.status === 'Livrée' ? 'selected' : ''}>Livrée</option>
                    </select>
                </div>
                
                <div class="form-group" style="margin-top: 15px;">
                    <label><strong>Numéro de suivi :</strong></label>
                    <input type="text" id="tracking-number" value="${order.trackingNumber || ''}" 
                           placeholder="Ex: 6A12345678901FR"
                           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px;">
                    <small style="color: #666;">Le numéro sera visible par le client</small>
                </div>
                
                <div class="form-group" style="margin-top: 15px;">
                    <label><strong>URL de suivi :</strong></label>
                    <input type="url" id="tracking-url" value="${order.trackingUrl || ''}" 
                           placeholder="https://www.laposte.fr/outils/suivre-vos-envois?code=..."
                           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px;">
                    <small style="color: #666;">Lien de suivi cliquable</small>
                </div>
                
                <div style="margin-top: 30px; display: flex; gap: 10px;">
                    <button type="submit" class="btn-edit" style="background: #4CAF50; padding: 12px 24px;">✅ Enregistrer</button>
                    <button type="button" onclick="closeClientModal()" class="btn-cancel" style="padding: 12px 24px;">❌ Annuler</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('client-details').innerHTML = trackingHTML;
    document.getElementById('client-modal').style.display = 'flex';
}

function saveOrderTracking(event) {
    event.preventDefault();
    
    if (!editingOrderId) return;
    
    const order = allOrders.find(o => o.id === editingOrderId);
    if (!order) return;
    
    const status = document.getElementById('order-status').value;
    const trackingNumber = document.getElementById('tracking-number').value.trim();
    const trackingUrl = document.getElementById('tracking-url').value.trim();
    
    order.status = status;
    order.trackingNumber = trackingNumber;
    order.trackingUrl = trackingUrl;
    
    fetch('api/save-orders.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({orders: allOrders})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Suivi mis à jour avec succès ! 📦', 'success');
            displayOrders();
            closeClientModal();
            editingOrderId = null;
        } else {
            showToast('Erreur lors de la mise à jour', 'error');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        showToast('Erreur lors de la mise à jour', 'error');
    });
}

function updateOrdersStats() {
    const totalOrders = allOrders.length;
    const totalOrdersEl = document.getElementById('total-orders');
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
}

function openDeleteOrderModal(orderId) {
    orderToDelete = orderId;
    document.getElementById('delete-order-modal').classList.add('show');
    document.getElementById('delete-order-modal').style.display = 'flex';
}

function closeDeleteOrderModal() {
    orderToDelete = null;
    document.getElementById('delete-order-modal').classList.remove('show');
    document.getElementById('delete-order-modal').style.display = 'none';
}

function confirmDeleteOrder() {
    if (!orderToDelete) return;

    allOrders = allOrders.filter(o => o.id !== orderToDelete);

    fetch('api/save-orders.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({orders: allOrders})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Commande supprimée avec succès ! 🗑️', 'success');
            displayOrders();
            updateOrdersStats();
        } else {
            showToast('Erreur lors de la suppression', 'error');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression', 'error');
    });

    closeDeleteOrderModal();
}

// ========================================
// GESTION DES MESSAGES CONTACT
// ========================================
function loadMessages() {
    fetch('api/get-messages.php')
        .then(response => response.json())
        .then(data => {
            allMessages = data.messages || [];
            displayMessages();
            updateMessagesStats();
        })
        .catch(error => {
            console.error('Erreur chargement messages:', error);
            allMessages = [];
        });
}

function displayMessages() {
    const tbody = document.getElementById('messages-list');
    if (!tbody) return;

    if (allMessages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:40px; color:#A38C7D;">📧 Aucun message</td></tr>';
        return;
    }

    tbody.innerHTML = allMessages.map(msg => `
        <tr style="background: ${msg.read ? 'white' : '#fffde7'};">
            <td>${msg.date}</td>
            <td><strong>${msg.nom}</strong></td>
            <td>${msg.email}</td>
            <td>${msg.subject || 'Sans sujet'}</td>
            <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${msg.message}</td>
            <td>
                <span class="badge-stock ${msg.read ? 'en-stock' : 'rupture'}">
                    ${msg.read ? '✅ Lu' : '📬 Non lu'}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button onclick="showMessageDetails(${msg.id})" class="btn-edit">👁️ Voir</button>
                    <button onclick="openReplyModal(${msg.id})" class="btn-edit" style="background: #2196F3;">📧 Répondre</button>
                    ${!msg.read ? `<button onclick="markAsRead(${msg.id})" class="btn-edit" style="background: #4CAF50;">✓ Marquer lu</button>` : ''}
                    <button onclick="openDeleteMessageModal(${msg.id})" class="btn-delete">🗑️ Supprimer</button>
                </div>
            </td>
        </tr>
    `).reverse().join('');
}

function showMessageDetails(messageId) {
    const message = allMessages.find(m => m.id === messageId);
    if (!message) return;

    const details = `
        <div style="text-align: left;">
            <p><strong>📧 Message de Contact</strong></p>
            <hr style="margin: 15px 0;">
            <p><strong>👤 Nom :</strong> ${message.nom}</p>
            <p><strong>📧 Email :</strong> <a href="mailto:${message.email}">${message.email}</a></p>
            <p><strong>📅 Date :</strong> ${message.date}</p>
            <p><strong>📌 Sujet :</strong> ${message.subject || 'Sans sujet'}</p>
            <hr style="margin: 15px 0;">
            <p><strong>💬 Message :</strong></p>
            <p style="background: #f8f0f0; padding: 15px; border-radius: 10px; line-height: 1.6;">
                ${message.message}
            </p>
            <hr style="margin: 15px 0;">
            <p><strong>Statut :</strong> 
                <span class="badge-stock ${message.read ? 'en-stock' : 'rupture'}">
                    ${message.read ? '✅ Lu' : '📬 Non lu'}
                </span>
            </p>
        </div>
    `;

    document.getElementById('message-details').innerHTML = details;
    document.getElementById('message-modal').classList.add('show');
    document.getElementById('message-modal').style.display = 'flex';

    if (!message.read) {
        markAsRead(messageId);
    }
}

function closeMessageModal() {
    document.getElementById('message-modal').classList.remove('show');
    document.getElementById('message-modal').style.display = 'none';
}

function markAsRead(messageId) {
    const message = allMessages.find(m => m.id === messageId);
    if (!message) return;

    message.read = true;

    fetch('api/save-messages.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messages: allMessages})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Message marqué comme lu ✅', 'success');
            displayMessages();
            updateMessagesStats();
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
}

function updateMessagesStats() {
    const unreadCount = allMessages.filter(m => !m.read).length;
    console.log(`📧 ${unreadCount} message(s) non lu(s)`);
}

function openDeleteMessageModal(messageId) {
    messageToDelete = messageId;
    document.getElementById('delete-message-modal').classList.add('show');
    document.getElementById('delete-message-modal').style.display = 'flex';
}

function closeDeleteMessageModal() {
    messageToDelete = null;
    document.getElementById('delete-message-modal').classList.remove('show');
    document.getElementById('delete-message-modal').style.display = 'none';
}

function confirmDeleteMessage() {
    if (!messageToDelete) return;

    allMessages = allMessages.filter(m => m.id !== messageToDelete);

    fetch('api/save-messages.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messages: allMessages})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Message supprimé avec succès ! 🗑️', 'success');
            displayMessages();
            updateMessagesStats();
        } else {
            showToast('Erreur lors de la suppression', 'error');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression', 'error');
    });

    closeDeleteMessageModal();
}

function updateClientsStats(count) {
    const elem = document.getElementById('total-clients');
    if (elem) elem.textContent = count;
}

// ========================================
// SYSTÈME DE RÉPONSE AUX MESSAGES
// ========================================
let currentReplyMessageId = null;

function openReplyModal(messageId) {
    const message = allMessages.find(m => m.id === messageId);
    if (!message) return;
    
    currentReplyMessageId = messageId;
    
    // Afficher le message original
    const originalMessageDiv = document.getElementById('reply-original-message');
    originalMessageDiv.innerHTML = `
        <p><strong>Message original de ${message.nom}</strong></p>
        <p><strong>Email :</strong> ${message.email}</p>
        <p><strong>Sujet :</strong> ${message.subject || 'Sans sujet'}</p>
        <p><strong>Date :</strong> ${message.date}</p>
        <hr style="margin: 10px 0;">
        <p style="font-style: italic;">${message.message}</p>
    `;
    
    // Pré-remplir le sujet
    document.getElementById('reply-subject').value = `Re: ${message.subject || 'Votre message'}`;
    document.getElementById('reply-message').value = '';
    
    // Afficher la modale
    document.getElementById('reply-modal').classList.add('show');
    document.getElementById('reply-modal').style.display = 'flex';
    
    // Marquer comme lu
    if (!message.read) {
        markAsRead(messageId);
    }
}

function closeReplyModal() {
    document.getElementById('reply-modal').classList.remove('show');
    document.getElementById('reply-modal').style.display = 'none';
    currentReplyMessageId = null;
}

// Gérer la soumission du formulaire de réponse
document.addEventListener('DOMContentLoaded', () => {
    const replyForm = document.getElementById('reply-form');
    if (replyForm) {
        replyForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!currentReplyMessageId) {
                showToast('Erreur: ID du message introuvable', 'error');
                return;
            }
            
            const message = allMessages.find(m => m.id === currentReplyMessageId);
            if (!message) {
                showToast('Erreur: Message introuvable', 'error');
                return;
            }
            
            const subject = document.getElementById('reply-subject').value;
            const replyMessage = document.getElementById('reply-message').value;
            
            if (!subject || !replyMessage) {
                showToast('Veuillez remplir tous les champs', 'error');
                return;
            }
            
            // Envoyer la réponse via API
            try {
                const response = await fetch('api/send-reply.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messageId: currentReplyMessageId,
                        to: message.email,
                        toName: message.nom,
                        subject: subject,
                        message: replyMessage,
                        originalMessage: message.message
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showToast('✅ Réponse envoyée avec succès !', 'success');
                    closeReplyModal();
                    
                    // Optionnel : marquer le message comme "répondu"
                    message.replied = true;
                    saveMessages();
                    displayMessages();
                } else {
                    showToast('❌ Erreur: ' + (data.error || 'Impossible d\'envoyer la réponse'), 'error');
                }
            } catch (error) {
                console.error('Erreur:', error);
                showToast('❌ Erreur lors de l\'envoi de la réponse', 'error');
            }
        });
    }
});

// ========================================
// INITIALISATION
// ========================================
window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Admin JS chargé !');
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            login(event);
        });
        console.log('✅ Formulaire de connexion attaché !');
    }
    
    checkAuth();
});

console.log('✅ Fichier admin.js chargé complètement');
