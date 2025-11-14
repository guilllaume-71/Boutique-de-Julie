// ===== VARIABLES GLOBALES =====
let products = [];
let isLoggedIn = false;
let editingProductId = null;
let deleteProductId = null;

// ===== IDENTIFIANTS ADMIN =====
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// ===== CONNEXION =====
function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        isLoggedIn = true;
        
        // Masquer le login et afficher l'admin
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-zone').style.display = 'block';
        
        // Charger les données
        loadProducts();
        displayProducts();
        updateStats();
    } else {
        alert('❌ Identifiants incorrects !');
    }
}

// ===== DÉCONNEXION =====
function deconnexion() {
    isLoggedIn = false;
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('admin-zone').style.display = 'none';
    document.getElementById('admin-username').value = '';
    document.getElementById('admin-password').value = '';
}

// ===== CHARGER PRODUITS =====
function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        // Produits par défaut avec LES VRAIES CATÉGORIES
        products = [
            {
                id: 1,
                name: "Fondant Lavande",
                category: "fondants",
                price: 8.90,
                stock: 25,
                image: "https://images.unsplash.com/photo-1602874801006-e74712b707b6?w=500",
                description: "Fondant parfumé à la lavande de Provence"
            },
            {
                id: 2,
                name: "Brûle-Parfum Céramique",
                category: "bruleparfums",
                price: 18.50,
                stock: 12,
                image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500",
                description: "Brûle-parfum en céramique artisanale"
            },
            {
                id: 3,
                name: "Coffret Découverte",
                category: "coffrets",
                price: 35.00,
                stock: 8,
                image: "https://images.unsplash.com/photo-1608533020029-31bb660d71a5?w=500",
                description: "Coffret contenant 6 fondants parfumés"
            },
            {
                id: 4,
                name: "Peigne Floral Rose",
                category: "peignes",
                price: 22.00,
                stock: 15,
                image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500",
                description: "Peigne à chignon orné de fleurs séchées roses"
            },
            {
                id: 5,
                name: "Boucles d'Oreilles Hortensia",
                category: "bijoux",
                price: 16.90,
                stock: 20,
                image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500",
                description: "Boucles d'oreilles en résine avec fleurs séchées"
            },
            {
                id: 6,
                name: "Couronne Champêtre",
                category: "couronnes",
                price: 45.00,
                stock: 5,
                image: "https://images.unsplash.com/photo-1522673607211-8c2f72f2d6b2?w=500",
                description: "Couronne de fleurs séchées style bohème"
            }
        ];
        
        localStorage.setItem('products', JSON.stringify(products));
    }
}

// ===== AFFICHER PRODUITS =====
function displayProducts(filter = '') {
    const tbody = document.getElementById('products-list');
    
    let filteredProducts = products;
    
    if (filter) {
        filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(filter.toLowerCase()) ||
            p.category.toLowerCase().includes(filter.toLowerCase())
        );
    }
    
    if (filteredProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: var(--texte-fonce);">
                    📭 Aucun produit trouvé
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredProducts.map(product => {
        const categoryNames = {
            'fondants': '🌸 Fondants parfumés',
            'bruleparfums': '🕯️ Brûle-parfums',
            'coffrets': '🎁 Coffrets',
            'peignes': '💐 Peignes à chignon',
            'bijoux': '💍 Bijoux en fleurs séchées',
            'couronnes': '👑 Couronnes en fleurs séchées'
        };
        
        return `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" class="product-img"></td>
                <td><strong>${product.name}</strong></td>
                <td>${categoryNames[product.category] || product.category}</td>
                <td><strong>${product.price.toFixed(2)} €</strong></td>
                <td>
                    <span class="badge-stock ${product.stock > 0 ? 'en-stock' : 'rupture'}">
                        ${product.stock > 0 ? `✅ ${product.stock} en stock` : '❌ Rupture'}
                    </span>
                </td>
                <td>
                    <div class="action-btns">
                        <button class="btn-edit" onclick="editProduct(${product.id})">✏️ Modifier</button>
                        <button class="btn-delete" onclick="openDeleteModal(${product.id})">🗑️ Supprimer</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ===== RECHERCHE =====
const searchInput = document.getElementById('search-product');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        displayProducts(e.target.value);
    });
}

// ===== METTRE À JOUR STATISTIQUES =====
function updateStats() {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStock = products.filter(p => p.stock < 5 && p.stock > 0).length;
    
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-value').textContent = totalValue.toFixed(2) + ' €';
    document.getElementById('total-stock').textContent = totalStock;
    document.getElementById('low-stock').textContent = lowStock;
}

// ===== CHANGEMENT D'ONGLET =====
function showTab(tabName) {
    // Masquer tous les contenus
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Désactiver tous les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activer l'onglet sélectionné
    document.getElementById('tab-' + tabName).classList.add('active');
    
    // Activer le bouton cliqué
    const buttons = document.querySelectorAll('.tab-btn');
    if (tabName === 'products') {
        buttons[0].classList.add('active');
    } else if (tabName === 'add') {
        buttons[1].classList.add('active');
    }
}

// ===== UPLOAD IMAGE =====
const imageUpload = document.getElementById('image-upload');
const fileInput = document.getElementById('file-input');

if (imageUpload) {
    imageUpload.addEventListener('click', () => {
        fileInput.click();
    });

    imageUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUpload.style.borderColor = 'var(--beige-moka)';
        imageUpload.style.background = 'white';
    });

    imageUpload.addEventListener('dragleave', () => {
        imageUpload.style.borderColor = 'var(--beige-clair)';
        imageUpload.style.background = 'var(--blanc-casse)';
    });

    imageUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleImage(file);
    });
}

if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleImage(file);
    });
}

function handleImage(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('preview-img').src = e.target.result;
            document.getElementById('image-preview').style.display = 'block';
            document.getElementById('image-upload').style.display = 'none';
            document.getElementById('product-image').value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function removeImage() {
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('image-upload').style.display = 'block';
    document.getElementById('product-image').value = '';
    if (fileInput) fileInput.value = '';
}

// ===== SOUMETTRE FORMULAIRE =====
function submitProduct(event) {
    event.preventDefault();
    
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('product-name').value.trim();
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const description = document.getElementById('product-description').value.trim();
    const image = document.getElementById('product-image').value || 'https://via.placeholder.com/300x300?text=Produit';
    
    if (!name || !category || !price || isNaN(price) || !stock || isNaN(stock)) {
        alert('❌ Veuillez remplir tous les champs obligatoires correctement !');
        return;
    }
    
    if (id) {
        // MODIFICATION
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = { id: parseInt(id), name, category, price, stock, description, image };
            alert('✅ Produit modifié avec succès !');
        }
    } else {
        // AJOUT
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, category, price, stock, description, image });
        alert('✅ Produit ajouté avec succès !');
    }
    
    // Sauvegarder et réinitialiser
    localStorage.setItem('products', JSON.stringify(products));
    document.getElementById('product-form').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('form-title').textContent = '➕ Ajouter un Nouveau Produit';
    removeImage();
    displayProducts();
    updateStats();
    
    // Revenir à l'onglet liste
    showTab('products');
}

// ===== MODIFIER PRODUIT =====
function editProduct(id) {
    const product = products.find(p => p.id === id);
    
    if (product) {
        document.getElementById('edit-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-image').value = product.image;
        
        // Afficher l'aperçu de l'image
        if (product.image) {
            document.getElementById('preview-img').src = product.image;
            document.getElementById('image-preview').style.display = 'block';
            document.getElementById('image-upload').style.display = 'none';
        }
        
        document.getElementById('form-title').textContent = '✏️ Modifier le Produit';
        
        // Changer d'onglet
        showTab('add');
    }
}

// ===== ANNULER MODIFICATION =====
function cancelEdit() {
    document.getElementById('product-form').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('form-title').textContent = '➕ Ajouter un Nouveau Produit';
    removeImage();
}

// ===== SUPPRIMER PRODUIT =====
function openDeleteModal(id) {
    deleteProductId = id;
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeDeleteModal() {
    deleteProductId = null;
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function confirmDelete() {
    if (deleteProductId !== null) {
        // Trouver le produit à supprimer
        const productToDelete = products.find(p => p.id === deleteProductId);
        
        if (productToDelete) {
            // Supprimer le produit
            products = products.filter(p => p.id !== deleteProductId);
            
            // Sauvegarder dans localStorage
            localStorage.setItem('products', JSON.stringify(products));
            
            // Mettre à jour l'affichage
            displayProducts();
            updateStats();
            closeDeleteModal();
            
            alert(`✅ Le produit "${productToDelete.name}" a été supprimé avec succès !`);
        }
    }
}

// ===== FERMER LA MODALE EN CLIQUANT EN DEHORS =====
window.onclick = function(event) {
    const modal = document.getElementById('delete-modal');
    if (event.target === modal) {
        closeDeleteModal();
    }
}
