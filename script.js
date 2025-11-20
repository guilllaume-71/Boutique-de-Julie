// ========================================
// GESTION DES ÉLÉMENTS
// ========================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

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
    
    // Ajouter l'animation CSS
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
            .toast:hover {
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
                transform: translateY(-2px);
                transition: all 0.2s ease;
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
// FONCTIONS API
// ========================================
async function loadUsersFromAPI() {
    try {
        const response = await fetch('api/get-users.php');
        const data = await response.json();
        return data.users || [];
    } catch (error) {
        console.error('Erreur chargement users:', error);
        return [];
    }
}

async function saveUsersToAPI(users) {
    try {
        const response = await fetch('api/save-users.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({users: users})
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Erreur sauvegarde users:', error);
        return false;
    }
}

async function loadProductsFromAPI() {
    try {
        const response = await fetch('api/get-products.php');
        const data = await response.json();
        return data.products || [];
    } catch (error) {
        console.error('Erreur chargement produits:', error);
        return [];
    }
}

// ========================================
// CHARGER LES PRODUITS
// ========================================
async function loadProducts(category = 'all') {
    console.log('🔄 Chargement des produits...');
    
    allProducts = await loadProductsFromAPI();
    console.log('✅ Produits chargés:', allProducts.length);
    
    if (allProducts.length === 0) {
        displayNoProducts();
    } else {
        displayProducts(category);
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

    if (!container) return;

    let productsToDisplay = category === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === category);

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
            <img src="${product.image || 'https://via.placeholder.com/300x200/F5E6D3/8B7355?text=Produit'}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200/F5E6D3/8B7355?text=Erreur'">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description || ''}</p>
            ${product.allergens && product.allergens.length > 0 ? `
                <div style="background: #FFF3CD; padding: 8px; border-radius: 5px; margin: 10px 0; font-size: 12px;">
                    <strong>⚠️ Allergènes :</strong> ${product.allergens.join(', ')}
                </div>
            ` : ''}
            <p class="product-price">${parseFloat(product.price).toFixed(2)} €</p>
            ${product.customizable ? `
                <p style="color: #2196F3; font-size: 14px; margin: 5px 0;">
                    ✨ Personnalisable
                </p>
            ` : ''}
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                🛒 Ajouter au panier
            </button>
        </div>
    `).join('');
}

// ========================================
// PANIER AVEC PERSONNALISATION
// ========================================
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);

    if (!product) {
        showToast('Produit introuvable', 'error');
        return;
    }

    // Si personnalisable, ouvrir la modale de personnalisation
    if (product.customizable) {
        openCustomizationModal(product);
        return;
    }

    // Sinon ajouter normalement
    addProductToCart(product, null);
}

function openCustomizationModal(product) {
    if (!product.options) {
        addProductToCart(product, null);
        return;
    }

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
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: scaleIn 0.3s ease;
    `;
    
    let customizationHTML = `
        <h3 style="color: #8B4789; margin-bottom: 10px; font-size: 24px;">✨ Personnaliser votre produit</h3>
        <p style="font-size: 18px; font-weight: bold; margin-bottom: 30px; color: #333;">${product.name}</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #666;"><strong>Prix de base :</strong> ${product.price.toFixed(2)}€</p>
            <p id="total-price" style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold; color: #8B4789;">Prix total : ${product.price.toFixed(2)}€</p>
        </div>
    `;
    
    let basePrice = parseFloat(product.price);
    
    // Générer les champs pour chaque option
    Object.keys(product.options).forEach(optionKey => {
        const option = product.options[optionKey];
        const isRequired = option.required ? ' <span style="color: red;">*</span>' : '';
        
        customizationHTML += `<div style="margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 20px;">`;
        customizationHTML += `<label style="display: block; margin-bottom: 12px; font-weight: bold; font-size: 16px; color: #555;">
            ${option.label}${isRequired}
        </label>`;
        
        // OPTIONS AVEC CHOIX (select/radio)
        if (option.choices && option.choices.length > 0) {
            customizationHTML += `<div class="option-choices" data-option="${optionKey}">`;
            
            option.choices.forEach((choice, index) => {
                const priceInfo = choice.priceModifier > 0 ? ` (+${choice.priceModifier.toFixed(2)}€)` : '';
                customizationHTML += `
                    <label style="display: block; padding: 12px; margin-bottom: 8px; cursor: pointer; 
                           border: 2px solid #ddd; border-radius: 8px; transition: all 0.2s; background: white;"
                           onmouseover="this.style.borderColor='#8B4789'; this.style.background='#f9f9f9';" 
                           onmouseout="if(!this.querySelector('input').checked) { this.style.borderColor='#ddd'; this.style.background='white'; }">
                        <input type="radio" name="option-${optionKey}" value="${choice.value}" 
                               data-price="${choice.priceModifier || 0}" data-option="${optionKey}"
                               ${index === 0 && option.required ? 'checked' : ''}
                               onchange="updateCustomPrice()"
                               style="margin-right: 10px; cursor: pointer;">
                        <span style="font-size: 15px;">${choice.label}${priceInfo}</span>
                    </label>
                `;
            });
            
            customizationHTML += `</div>`;
        }
        // INPUT TEXTE
        else if (option.type === 'text') {
            const priceInfo = option.priceModifier > 0 ? ` (+${option.priceModifier.toFixed(2)}€)` : '';
            customizationHTML += `
                <input type="text" id="option-${optionKey}" 
                       placeholder="${option.placeholder || 'Entrez votre texte'}"
                       data-price="${option.priceModifier || 0}" data-option="${optionKey}"
                       onkeyup="updateCustomPrice()"
                       ${option.required ? 'required' : ''}
                       style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; 
                              font-size: 14px; transition: border-color 0.2s;">
                <small style="color: #666; display: block; margin-top: 5px;">
                    ${option.required ? 'Champ requis' : 'Optionnel'}${priceInfo}
                </small>
            `;
        }
        // SELECT
        else if (option.type === 'select' && option.choices) {
            customizationHTML += `
                <select id="option-${optionKey}" data-price-base="0" data-option="${optionKey}"
                        onchange="updateCustomPrice()"
                        ${option.required ? 'required' : ''}
                        style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; 
                               font-size: 14px; cursor: pointer; background: white;">
                    ${!option.required ? '<option value="">-- Sélectionnez --</option>' : ''}
                    ${option.choices.map(choice => {
                        const priceInfo = choice.priceModifier > 0 ? ` (+${choice.priceModifier.toFixed(2)}€)` : '';
                        return `<option value="${choice.value}" data-price="${choice.priceModifier || 0}">
                            ${choice.label}${priceInfo}
                        </option>`;
                    }).join('')}
                </select>
            `;
        }
        // CHECKBOX
        else if (option.type === 'checkbox') {
            const priceInfo = option.priceModifier > 0 ? ` (+${option.priceModifier.toFixed(2)}€)` : '';
            customizationHTML += `
                <label style="display: flex; align-items: center; padding: 12px; cursor: pointer; 
                       border: 2px solid #ddd; border-radius: 8px; background: white; transition: all 0.2s;"
                       onmouseover="this.style.borderColor='#8B4789'; this.style.background='#f9f9f9';" 
                       onmouseout="if(!this.querySelector('input').checked) { this.style.borderColor='#ddd'; this.style.background='white'; }">
                    <input type="checkbox" id="option-${optionKey}" 
                           data-price="${option.priceModifier || 0}" data-option="${optionKey}"
                           onchange="updateCustomPrice()"
                           style="margin-right: 10px; width: 18px; height: 18px; cursor: pointer;">
                    <span style="font-size: 15px;">${option.label}${priceInfo}</span>
                </label>
            `;
        }
        
        customizationHTML += `</div>`;
    });
    
    customizationHTML += `
        <div style="display: flex; gap: 12px; margin-top: 30px;">
            <button id="add-custom-product" style="
                flex: 1;
                padding: 14px 24px;
                background: linear-gradient(135deg, #8B4789 0%, #A85A9A 100%);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                transition: transform 0.2s, box-shadow 0.2s;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(139,71,137,0.4)';"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                ✅ Ajouter au panier
            </button>
            <button id="cancel-custom" style="
                padding: 14px 24px;
                background: #f44336;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                transition: transform 0.2s, box-shadow 0.2s;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(244,67,54,0.4)';"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                ❌ Annuler
            </button>
        </div>
    `;
    
    modal.innerHTML = customizationHTML;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Fonction pour mettre à jour le prix total
    window.updateCustomPrice = function() {
        let totalPrice = basePrice;
        
        // Parcourir tous les radios sélectionnés
        modal.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
            totalPrice += parseFloat(radio.dataset.price || 0);
        });
        
        // Parcourir tous les checkboxes cochés
        modal.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            totalPrice += parseFloat(checkbox.dataset.price || 0);
        });
        
        // Parcourir tous les inputs texte remplis
        modal.querySelectorAll('input[type="text"]').forEach(input => {
            if (input.value.trim() !== '') {
                totalPrice += parseFloat(input.dataset.price || 0);
            }
        });
        
        // Parcourir tous les selects
        modal.querySelectorAll('select').forEach(select => {
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption && selectedOption.dataset.price) {
                totalPrice += parseFloat(selectedOption.dataset.price);
            }
        });
        
        document.getElementById('total-price').textContent = `Prix total : ${totalPrice.toFixed(2)}€`;
    };
    
    // Initialiser le prix
    updateCustomPrice();
    
    // Bouton ajouter au panier
    document.getElementById('add-custom-product').onclick = () => {
        const customization = {};
        let finalPrice = basePrice;
        let isValid = true;
        
        // Récupérer toutes les options
        Object.keys(product.options).forEach(optionKey => {
            const option = product.options[optionKey];
            
            if (option.choices) {
                // Radio buttons
                const selected = modal.querySelector(`input[name="option-${optionKey}"]:checked`);
                if (selected) {
                    customization[optionKey] = selected.value;
                    finalPrice += parseFloat(selected.dataset.price || 0);
                } else if (option.required) {
                    showToast(`Veuillez sélectionner ${option.label}`, 'error');
                    isValid = false;
                }
            } else if (option.type === 'text') {
                const input = modal.querySelector(`#option-${optionKey}`);
                if (input && input.value.trim()) {
                    customization[optionKey] = input.value.trim();
                    finalPrice += parseFloat(input.dataset.price || 0);
                } else if (option.required) {
                    showToast(`Veuillez remplir ${option.label}`, 'error');
                    isValid = false;
                }
            } else if (option.type === 'select') {
                const select = modal.querySelector(`#option-${optionKey}`);
                if (select && select.value) {
                    customization[optionKey] = select.value;
                    const selectedOption = select.options[select.selectedIndex];
                    if (selectedOption && selectedOption.dataset.price) {
                        finalPrice += parseFloat(selectedOption.dataset.price);
                    }
                } else if (option.required) {
                    showToast(`Veuillez sélectionner ${option.label}`, 'error');
                    isValid = false;
                }
            } else if (option.type === 'checkbox') {
                const checkbox = modal.querySelector(`#option-${optionKey}`);
                if (checkbox && checkbox.checked) {
                    customization[optionKey] = true;
                    finalPrice += parseFloat(checkbox.dataset.price || 0);
                }
            }
        });
        
        if (!isValid) return;
        
        // Ajouter au panier avec le prix final
        addProductToCart(product, customization, finalPrice);
        overlay.remove();
    };
    
    document.getElementById('cancel-custom').onclick = () => {
        overlay.remove();
    };
    
    overlay.onclick = (e) => {
        if (e.target === overlay) overlay.remove();
    };
}

function addProductToCart(product, customization, finalPrice = null) {
    const cartItem = {
        id: Date.now(), // ID unique pour chaque article (même produit peut avoir plusieurs personnalisations)
        productId: product.id,
        name: product.name,
        price: finalPrice !== null ? parseFloat(finalPrice) : parseFloat(product.price),
        basePrice: parseFloat(product.price),
        image: product.image || 'https://via.placeholder.com/80x80/F5E6D3/8B7355?text=Produit',
        quantity: 1,
        customization: customization
    };
    
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    showToast(`${product.name} ajouté au panier ! 🛒`, 'success');
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

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    container.innerHTML = cart.map(item => {
        // Construire l'affichage des personnalisations
        let customHTML = '';
        if (item.customization && Object.keys(item.customization).length > 0) {
            customHTML = '<div style="background: #f0f8ff; padding: 10px; border-radius: 6px; font-size: 13px; margin-top: 8px; border-left: 3px solid #8B4789;">';
            
            // Trouver le produit original pour avoir les labels
            const originalProduct = allProducts.find(p => p.id === item.productId);
            
            Object.keys(item.customization).forEach(key => {
                const value = item.customization[key];
                let label = key;
                let displayValue = value;
                
                // Si on a le produit original, utiliser les vrais labels
                if (originalProduct && originalProduct.options && originalProduct.options[key]) {
                    label = originalProduct.options[key].label;
                    
                    // Si c'est un choix, trouver le label correspondant
                    if (originalProduct.options[key].choices) {
                        const choice = originalProduct.options[key].choices.find(c => c.value === value);
                        if (choice) displayValue = choice.label;
                    }
                }
                
                // Icônes selon le type
                let icon = '✨';
                if (key === 'size') icon = '📏';
                else if (key === 'text') icon = '💬';
                else if (key === 'flowers' || key === 'driedFlowers') icon = '🌸';
                else if (key === 'color') icon = '🎨';
                else if (key === 'material') icon = '💎';
                
                if (typeof displayValue === 'boolean') {
                    displayValue = displayValue ? 'Oui' : 'Non';
                }
                
                customHTML += `<p style="margin: 4px 0;"><strong>${icon} ${label} :</strong> ${displayValue}</p>`;
            });
            
            customHTML += '</div>';
        }
        
        // Info prix
        let priceInfo = `${item.price.toFixed(2)} €`;
        if (item.basePrice && item.price !== item.basePrice) {
            priceInfo = `<span style="color: #999; text-decoration: line-through; font-size: 12px;">${item.basePrice.toFixed(2)} €</span> ${item.price.toFixed(2)} €`;
        }
        
        return `
        <div class="cart-item" style="border: 1px solid #ddd; border-radius: 10px; padding: 15px; margin-bottom: 15px; display: flex; gap: 15px; align-items: center; background: white; transition: box-shadow 0.2s;">
            <img src="${item.image}" 
                 alt="${item.name}" 
                 style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;"
                 onerror="this.src='https://via.placeholder.com/80x80/F5E6D3/8B7355?text=Produit'">
            <div style="flex: 1;">
                <h4 style="margin: 0 0 8px 0; color: #333;">${item.name}</h4>
                ${customHTML}
                <p style="margin: 8px 0 0 0; color: #666; font-size: 15px;">${priceInfo} × ${item.quantity}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <button onclick="updateQuantity('${item.id}', -1)" style="background: #8B4789; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 16px; transition: background 0.2s;" onmouseover="this.style.background='#6d3569'" onmouseout="this.style.background='#8B4789'">-</button>
                <span style="font-size: 18px; font-weight: bold; min-width: 30px; text-align: center;">${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', 1)" style="background: #8B4789; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 16px; transition: background 0.2s;" onmouseover="this.style.background='#6d3569'" onmouseout="this.style.background='#8B4789'">+</button>
                <button onclick="removeFromCart('${item.id}')" style="background: #D32F2F; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-left: 10px; transition: background 0.2s;" onmouseover="this.style.background='#b71c1c'" onmouseout="this.style.background='#D32F2F'">🗑️</button>
            </div>
        </div>
    `;
    }).join('');

    summary.innerHTML = `
        <h3 style="color: #A38C7D; font-size: 32px; margin-bottom: 20px;">Récapitulatif</h3>
        <p style="font-size: 24px; margin-bottom: 10px;">Sous-total : ${subtotal.toFixed(2)} €</p>
        <p style="font-size: 14px; color: #666; margin-bottom: 30px;">Les frais de livraison seront calculés à l'étape suivante</p>
        <button class="btn-enter" onclick="checkout()">Passer la commande</button>
    `;
}

function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id == itemId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(itemId);
        return;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id != itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

function checkout() {
    if (!currentUser) {
        showToast('Veuillez vous connecter ou créer un compte pour commander', 'warning');
        showPage('connexion');
    } else {
        goToPayment();
    }
}

// ========================================
// PAIEMENT AVEC CHOIX LIVRAISON
// ========================================
let selectedShippingMethod = null;
let shippingCost = 0;

function goToPayment() {
    if (cart.length === 0) {
        showToast('Votre panier est vide !', 'warning');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Afficher le récapitulatif
    document.getElementById('payment-items').innerHTML = cart.map(item => `
        <div class="payment-item" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
            <span>${item.name} × ${item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)} €</span>
        </div>
    `).join('');
    
    // Ajouter le choix de livraison AVANT le récapitulatif
    const paymentContainer = document.querySelector('.payment-summary');
    if (paymentContainer && !document.getElementById('shipping-selection')) {
        const shippingHTML = `
            <div id="shipping-selection" style="margin: 30px 0; padding: 20px; background: #f8f8f8; border-radius: 10px;">
                <h3 style="color: #A38C7D; margin-bottom: 20px;">🚚 Choisissez votre mode de livraison</h3>
                
                <label style="display: block; padding: 15px; margin-bottom: 10px; background: white; border: 2px solid #ddd; border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                       onclick="selectShipping('laposte', 5.00)" id="shipping-laposte">
                    <input type="radio" name="shipping" value="laposte" style="margin-right: 10px;">
                    <strong>📦 La Poste - Colissimo</strong>
                    <span style="float: right; color: #4CAF50; font-weight: bold;">5,00 €</span>
                    <p style="margin: 5px 0 0 25px; font-size: 13px; color: #666;">Livraison en 3-5 jours ouvrés</p>
                </label>
                
                <label style="display: block; padding: 15px; margin-bottom: 10px; background: white; border: 2px solid #ddd; border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                       onclick="selectShipping('chronopost', 8.00)" id="shipping-chronopost">
                    <input type="radio" name="shipping" value="chronopost" style="margin-right: 10px;">
                    <strong>⚡ Chronopost - Livraison Express</strong>
                    <span style="float: right; color: #4CAF50; font-weight: bold;">8,00 €</span>
                    <p style="margin: 5px 0 0 25px; font-size: 13px; color: #666;">Livraison en 24h-48h</p>
                </label>
                
                <label style="display: block; padding: 15px; background: white; border: 2px solid #ddd; border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                       onclick="selectShipping('relais', 3.50)" id="shipping-relais">
                    <input type="radio" name="shipping" value="relais" style="margin-right: 10px;">
                    <strong>📍 Point Relais</strong>
                    <span style="float: right; color: #4CAF50; font-weight: bold;">3,50 €</span>
                    <p style="margin: 5px 0 0 25px; font-size: 13px; color: #666;">Retrait en point relais sous 3-5 jours</p>
                </label>
            </div>
        `;
        
        paymentContainer.insertAdjacentHTML('afterbegin', shippingHTML);
    }
    
    updatePaymentTotal(subtotal);
    showPage('paiement');
}

function selectShipping(method, cost) {
    selectedShippingMethod = method;
    shippingCost = cost;
    
    // Mettre à jour le style
    document.querySelectorAll('[id^="shipping-"]').forEach(el => {
        el.style.borderColor = '#ddd';
        el.style.background = 'white';
    });
    
    const selected = document.getElementById(`shipping-${method}`);
    if (selected) {
        selected.style.borderColor = '#4CAF50';
        selected.style.background = '#f0fff4';
    }
    
    // Recalculer le total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updatePaymentTotal(subtotal);
}

function updatePaymentTotal(subtotal) {
    const total = subtotal + shippingCost;
    
    document.getElementById('payment-total-amount').innerHTML = `
        <div style="text-align: right;">
            <p style="font-size: 16px; margin: 5px 0;">Sous-total : ${subtotal.toFixed(2)} €</p>
            ${shippingCost > 0 ? `<p style="font-size: 16px; margin: 5px 0;">Livraison : ${shippingCost.toFixed(2)} €</p>` : ''}
            <p style="font-size: 24px; font-weight: bold; margin-top: 10px; color: #A38C7D;">Total : ${total.toFixed(2)} €</p>
        </div>
    `;
}

function selectPaymentMethod(method) {
    if (!selectedShippingMethod) {
        showToast('Veuillez d\'abord choisir un mode de livraison', 'warning');
        return;
    }
    
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
    if (!selectedShippingMethod) {
        showToast('Veuillez choisir un mode de livraison', 'warning');
        return;
    }
    
    confirmAction('Vous allez être redirigé vers SumUp. Continuer ?', () => {
        showToast('Paiement SumUp en cours...', 'info');
        setTimeout(() => {
            finalizeOrder('SumUp');
        }, 1000);
    });
}

function processPayPalPayment() {
    if (!selectedShippingMethod) {
        showToast('Veuillez choisir un mode de livraison', 'warning');
        return;
    }
    
    confirmAction('Vous allez être redirigé vers PayPal. Continuer ?', () => {
        showToast('Paiement PayPal en cours...', 'info');
        setTimeout(() => {
            finalizeOrder('PayPal');
        }, 1000);
    });
}

async function finalizeOrder(paymentMethod) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + shippingCost;
    
    const shippingMethodNames = {
        'laposte': 'La Poste - Colissimo',
        'chronopost': 'Chronopost - Livraison Express',
        'relais': 'Point Relais'
    };
    
    const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString('fr-FR'),
        items: cart.map(item => ({
            id: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            customization: item.customization
        })),
        subtotal: subtotal,
        shippingCost: shippingCost,
        shippingMethod: shippingMethodNames[selectedShippingMethod],
        total: total,
        status: 'En préparation',
        paymentMethod: paymentMethod,
        shippingAddress: {
            nom: currentUser.nom,
            adresse: currentUser.adresse,
            codePostal: currentUser.codePostal,
            ville: currentUser.ville,
            telephone: currentUser.telephone
        },
        trackingNumber: '',
        trackingUrl: ''
    };
    
    try {
        const response = await fetch('api/save-order.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                order: order,
                userId: currentUser.id
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Commande sauvegardée:', order.id);
            showToast(`Commande n°${order.id} validée avec succès ! 🎉`, 'success');
        } else {
            console.error('Erreur:', data.message);
            showToast('Erreur lors de la sauvegarde', 'error');
        }
    } catch (error) {
        console.error('Erreur sauvegarde commande:', error);
        showToast('Erreur réseau', 'error');
    }
    
    cart = [];
    selectedShippingMethod = null;
    shippingCost = 0;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
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

async function login(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = await loadUsersFromAPI();
    const user = users.find(u => u.email === email && u.password === password && u.role === 'client');

    if (!user) {
        showToast('Email ou mot de passe incorrect', 'error');
        return;
    }

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showToast('Connexion réussie ! 🎉', 'success');

    document.getElementById('connexionBtn').style.display = 'none';
    document.getElementById('profilBtn').style.display = 'inline-block';
    document.getElementById('panierBtn').style.display = 'inline-block';
    document.getElementById('deconnexionBtn').style.display = 'inline-block';

    showPage('boutique');
}

async function createAccount(event) {
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
        showToast('Les mots de passe ne correspondent pas', 'error');
        return;
    }

    const users = await loadUsersFromAPI();
    
    if (users.find(u => u.email === email)) {
        showToast('Un compte avec cet email existe déjà', 'error');
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
    await saveUsersToAPI(users);
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showToast('Compte créé avec succès ! 🎉', 'success');

    document.getElementById('connexionBtn').style.display = 'none';
    document.getElementById('profilBtn').style.display = 'inline-block';
    document.getElementById('panierBtn').style.display = 'inline-block';
    document.getElementById('deconnexionBtn').style.display = 'inline-block';

    showPage('boutique');
}

// ========================================
// DÉCONNEXION
// ========================================
function logout() {
    confirmAction('Voulez-vous vraiment vous déconnecter ?', () => {
        currentUser = null;
        cart = [];
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        
        showToast('Déconnexion réussie ! À bientôt 👋', 'info');
        
        document.getElementById('connexionBtn').style.display = 'inline-block';
        document.getElementById('profilBtn').style.display = 'none';
        document.getElementById('panierBtn').style.display = 'none';
        document.getElementById('deconnexionBtn').style.display = 'none';
        
        updateCartCount();
        showPage('accueil');
    });
}

// ========================================
// PROFIL
// ========================================
function loadProfileData() {
    if (!currentUser) {
        showToast('Veuillez vous connecter', 'warning');
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

    fetch('api/get-orders.php')
        .then(response => response.json())
        .then(data => {
            const allOrders = data.orders || [];
            const orders = allOrders.filter(order => order.userId === currentUser.id);
            displayOrdersInProfile(orders);
        })
        .catch(error => {
            console.error('Erreur chargement commandes:', error);
            displayOrdersInProfile([]);
        });
}

function displayOrdersInProfile(orders) {
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
                <span style="background: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px; font-size: 16px;">${order.status}</span>
            </div>
            <p style="font-size: 18px; margin: 5px 0;"><strong>📅 Date :</strong> ${order.date}</p>
            <p style="font-size: 18px; margin: 5px 0;"><strong>💰 Total :</strong> ${order.total.toFixed(2)} €</p>
            ${order.paymentMethod ? `<p style="font-size: 18px; margin: 5px 0;"><strong>💳 Paiement :</strong> ${order.paymentMethod}</p>` : ''}
            ${order.shippingMethod ? `<p style="font-size: 18px; margin: 5px 0;"><strong>🚚 Livraison :</strong> ${order.shippingMethod}</p>` : ''}
            ${order.trackingNumber ? `
                <p style="font-size: 18px; margin: 5px 0;">
                    <strong>📦 Suivi :</strong> 
                    <a href="${order.trackingUrl || '#'}" target="_blank" style="color: #2196F3; text-decoration: none;">
                        ${order.trackingNumber} 🔗
                    </a>
                </p>
            ` : ''}
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                ${order.items.map(item => `
                    <div style="padding: 8px 0; border-bottom: 1px dashed #eee;">
                        <p style="font-size: 16px; margin: 0;"><strong>${item.name}</strong> × ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} €</p>
                        ${item.customization ? `
                            <div style="background: #E3F2FD; padding: 5px 10px; border-radius: 5px; margin-top: 5px; font-size: 13px;">
                                ${item.customization.text ? `<p style="margin: 2px 0;">💬 ${item.customization.text}</p>` : ''}
                                ${item.customization.flowers ? `<p style="margin: 2px 0;">🌸 ${item.customization.flowers.join(', ')}</p>` : ''}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `).reverse().join('');
}

async function updateProfile(event) {
    event.preventDefault();

    if (!currentUser) return;

    currentUser.nom = document.getElementById('profileNom').value;
    currentUser.email = document.getElementById('profileEmail').value;
    currentUser.telephone = document.getElementById('profileTelephone').value;
    currentUser.adresse = document.getElementById('profileAdresse').value;
    currentUser.codePostal = document.getElementById('profileCodePostal').value;
    currentUser.ville = document.getElementById('profileVille').value;

    const users = await loadUsersFromAPI();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
        users[index] = currentUser;
        await saveUsersToAPI(users);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    showToast('Informations mises à jour ! ✅', 'success');
}

async function changePassword(event) {
    event.preventDefault();

    if (!currentUser) return;

    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (oldPassword !== currentUser.password) {
        showToast('Ancien mot de passe incorrect', 'error');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        showToast('Les nouveaux mots de passe ne correspondent pas', 'error');
        return;
    }

    currentUser.password = newPassword;
    
    const users = await loadUsersFromAPI();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
        users[index] = currentUser;
        await saveUsersToAPI(users);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    showToast('Mot de passe modifié avec succès ! 🔒', 'success');
    document.getElementById('passwordForm').reset();
}

async function deleteAccount() {
    if (!currentUser) return;

    confirmAction('⚠️ Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible !', async () => {
        let users = await loadUsersFromAPI();
        users = users.filter(u => u.id !== currentUser.id);
        await saveUsersToAPI(users);
        
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        
        currentUser = null;
        cart = [];
        updateCartCount();
        
        showToast('Votre compte a été supprimé.', 'info');
        showPage('accueil');
    });
}

// ========================================
// FORMULAIRE DE CONTACT
// ========================================
function sendContactMessage(event) {
    event.preventDefault();
    
    const nom = document.getElementById('contactNom').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    const contactData = {
        id: Date.now(),
        nom: nom,
        email: email,
        subject: subject,
        message: message,
        date: new Date().toLocaleString('fr-FR')
    };
    
    fetch('api/send-contact.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Message envoyé avec succès ! 📨', 'success');
            document.querySelector('#contact form').reset();
        } else {
            showToast('Erreur lors de l\'envoi', 'error');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        showToast('Message envoyé avec succès ! 📨', 'success');
        document.querySelector('#contact form').reset();
    });
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
        document.getElementById('deconnexionBtn').style.display = 'none';
    } else {
        if (currentUser) {
            document.getElementById('connexionBtn').style.display = 'none';
            document.getElementById('profilBtn').style.display = 'inline-block';
            document.getElementById('panierBtn').style.display = 'inline-block';
            document.getElementById('deconnexionBtn').style.display = 'inline-block';
        } else {
            document.getElementById('connexionBtn').style.display = 'inline-block';
            document.getElementById('profilBtn').style.display = 'none';
            document.getElementById('panierBtn').style.display = 'inline-block';
            document.getElementById('deconnexionBtn').style.display = 'none';
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
            <img src="${product.image || 'https://via.placeholder.com/300x200/F5E6D3/8B7355?text=Produit'}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description || ''}</p>
            ${product.allergens && product.allergens.length > 0 ? `
                <div style="background: #FFF3CD; padding: 8px; border-radius: 5px; margin: 10px 0; font-size: 12px;">
                    <strong>⚠️ Allergènes :</strong> ${product.allergens.join(', ')}
                </div>
            ` : ''}
            <p class="product-price">${parseFloat(product.price).toFixed(2)} €</p>
            ${product.customizable ? `
                <p style="color: #2196F3; font-size: 14px; margin: 5px 0;">
                    ✨ Personnalisable
                </p>
            ` : ''}
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

// ========================================
// INITIALISATION
// ========================================
window.addEventListener('load', () => {
    updateCartCount();

    if (currentUser) {
        document.getElementById('connexionBtn').style.display = 'none';
        document.getElementById('profilBtn').style.display = 'inline-block';
        document.getElementById('panierBtn').style.display = 'inline-block';
        document.getElementById('deconnexionBtn').style.display = 'inline-block';
    }
    
    // Charger les produits
    loadProducts('all');
});

// Synchronisation auto
setInterval(() => {
    if (currentUser) {
        loadOrders();
    }
    
    const activePage = document.querySelector('.page.active');
    if (activePage && ['fondants', 'bruleparfums', 'coffrets', 'peignes', 'bijoux', 'couronnes', 'all-products'].includes(activePage.id)) {
        const category = activePage.id === 'all-products' ? 'all' : activePage.id;
        loadProducts(category);
    }
}, 30000);
