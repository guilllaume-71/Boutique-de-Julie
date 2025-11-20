# 🌸 Pois De Senteurs By Julie - Nouvelles Fonctionnalités

## ✨ Fonctionnalités Ajoutées

### 1️⃣ **Toast Notifications** 🎉
- Remplace tous les `alert()` par des notifications élégantes
- 4 types disponibles : `success`, `error`, `info`, `warning`
- Animation fluide en haut à droite
- Disparaît automatiquement après 3 secondes

**Utilisation :**
```javascript
showToast('Message de succès !', 'success');
showToast('Erreur survenue', 'error');
showToast('Information', 'info');
showToast('Attention !', 'warning');
```

---

### 2️⃣ **Bouton Déconnexion** 🚪
- Ajouté dans la sidebar du profil client
- Style distinctif (fond marron, texte blanc)
- Confirmation avant déconnexion
- Notification toast après déconnexion
- Réinitialise le panier et les données utilisateur

**Emplacement :** Page Profil → Bouton "🚪 Déconnexion"

---

### 3️⃣ **Page Contact** 📧
- Nouvelle page complète avec formulaire
- Bouton "📧 Contact" dans le header
- Champs : Nom, Email, Sujet, Message
- Design cohérent avec le reste du site
- Validation des champs
- Envoi vers l'API PHP `api/send-contact.php`
- Sauvegarde locale en cas d'erreur API

**Accès :** Header → Bouton "📧 Contact"

---

### 4️⃣ **Synchronisation Temps Réel** ⏱️
- Rafraîchissement automatique toutes les 30 secondes
- Recharge les commandes si l'utilisateur est connecté
- Recharge les produits si on est sur une page catégorie
- Fonctionne en arrière-plan sans intervention

**Fonctionnement :** Automatique dès le chargement de la page

---

## 📦 Fichiers Modifiés

### 1. **index.html**
- ✅ Bouton "📧 Contact" ajouté au header (ligne 21)
- ✅ Bouton "🚪 Déconnexion" ajouté au profil (ligne 331)
- ✅ Nouvelle page Contact complète (lignes 409-439)

### 2. **style.css**
- ✅ Styles Toast déjà présents (lignes 853-903)
- ✅ Styles Contact ajoutés (lignes 906-937)

### 3. **script.js**
- ✅ Fonction `showToast()` et `getToastIcon()` (lignes 8-34)
- ✅ Fonction `logout()` (lignes 808-828)
- ✅ Fonction `sendContactMessage()` (lignes 830-878)
- ✅ Fonction `startAutoRefresh()` (lignes 880-898)
- ✅ Tous les `alert()` remplacés par `showToast()`

---

## 🚀 Installation

### Étape 1 : Remplacer les fichiers
```bash
# Remplacer les anciens fichiers par les nouveaux
cp index.html /chemin/vers/votre/site/
cp style.css /chemin/vers/votre/site/
cp script.js /chemin/vers/votre/site/
```

### Étape 2 : Vérifier l'API Contact
Assurez-vous que le fichier `api/send-contact.php` existe et fonctionne :

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$data = json_decode(file_get_contents('php://input'), true);

// Sauvegarder dans messages.json
$messages = json_decode(file_get_contents('../data/messages.json'), true) ?? [];
$messages[] = $data;
file_put_contents('../data/messages.json', json_encode($messages, JSON_PRETTY_PRINT));

echo json_encode(['success' => true]);
?>
```

### Étape 3 : Tester
1. Ouvrir le site dans le navigateur
2. Tester les notifications toast
3. Tester le bouton déconnexion
4. Tester le formulaire contact
5. Vérifier la synchronisation automatique

---

## 🎨 Personnalisation

### Modifier la durée des Toast
Dans `script.js`, ligne 20 :
```javascript
setTimeout(() => {
    toast.remove();
}, 3000); // Changer 3000 pour ajuster (millisecondes)
```

### Modifier l'intervalle de synchronisation
Dans `script.js`, ligne 893 :
```javascript
}, 30000); // Changer 30000 pour ajuster (millisecondes)
```

### Changer les couleurs des Toast
Dans `style.css`, lignes 871-882 :
```css
.toast-notification.success {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.toast-notification.error {
    background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

.toast-notification.info {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
```

---

## ✅ Tests à Effectuer

### Test 1 : Toast Notifications
1. Ajouter un produit au panier → Toast vert "Produit ajouté"
2. Modifier le profil → Toast vert "Informations mises à jour"
3. Changer le mot de passe → Toast vert "Mot de passe modifié"
4. Tenter de commander sans connexion → Toast orange "Veuillez vous connecter"

### Test 2 : Déconnexion
1. Se connecter
2. Aller dans Profil
3. Cliquer "🚪 Déconnexion"
4. Confirmer
5. Vérifier : Toast bleu + retour accueil + boutons header changés

### Test 3 : Contact
1. Cliquer "📧 Contact" dans le header
2. Remplir le formulaire
3. Envoyer
4. Vérifier : Toast vert + formulaire vidé
5. Vérifier dans `data/messages.json` (si API fonctionne)

### Test 4 : Synchronisation
1. Ouvrir 2 onglets du site
2. Ajouter une commande dans l'onglet 1
3. Attendre 30 secondes
4. Vérifier dans l'onglet 2 : la commande apparaît automatiquement

---

## 🐛 Résolution de Problèmes

### Les Toast n'apparaissent pas
- Vérifier que `style.css` est bien chargé
- Vérifier la console JavaScript (F12) pour les erreurs
- S'assurer que les styles Toast sont bien présents (lignes 853-903)

### Le bouton Contact ne fait rien
- Vérifier que `script.js` est chargé
- Vérifier la fonction `sendContactMessage()` (ligne 830)
- Vérifier que l'API `api/send-contact.php` existe

### La déconnexion ne fonctionne pas
- Vérifier la fonction `logout()` (ligne 808)
- Vérifier la console pour les erreurs
- S'assurer que `currentUser` est bien défini

### La synchronisation ne marche pas
- Vérifier la fonction `startAutoRefresh()` (ligne 880)
- Ouvrir la console et chercher des erreurs
- Augmenter l'intervalle si le site est lent

---

## 📊 Structure Complète

```
POIS-DE-SENTEURS/
├── index.html          ✅ MODIFIÉ
├── style.css           ✅ MODIFIÉ
├── script.js           ✅ MODIFIÉ
├── api/
│   ├── send-contact.php  ⚠️ À VÉRIFIER
│   ├── get-products.php
│   ├── save-products.php
│   ├── get-users.php
│   ├── save-users.php
│   ├── get-orders.php
│   ├── save-orders.php
│   └── save-order.php
└── data/
    ├── products.json
    ├── users.json
    ├── orders.json
    └── messages.json     ⚠️ CRÉER SI INEXISTANT
```

---

## 🎯 Prochaines Étapes Recommandées

1. **Migration complète vers Base de données PHP**
   - Remplacer `localStorage` par des appels API
   - Tous les fichiers API sont déjà prêts

2. **Dashboard Admin amélioré**
   - Voir les messages contact
   - Supprimer des commandes
   - Gérer les utilisateurs

3. **Optimisation**
   - Compression des images
   - Minification CSS/JS
   - Cache navigateur

---

## 📞 Support

Pour toute question ou problème :
- Ouvrir la console (F12) pour voir les erreurs
- Vérifier que tous les fichiers sont bien chargés
- Tester dans un navigateur différent

---

✨ **Bon travail et bonne utilisation !** 🌸
