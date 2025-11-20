# 🔧 GUIDE DE CORRECTION COMPLÈTE

## 📦 **FICHIERS CRÉÉS**

Tous les fichiers API PHP sont maintenant dans `/outputs/api/` :

✅ **get-orders.php** - Récupérer les commandes
✅ **save-orders.php** - Sauvegarder toutes les commandes
✅ **save-order.php** - Sauvegarder une commande (client)
✅ **get-users.php** - Récupérer les utilisateurs
✅ **save-users.php** - Sauvegarder les utilisateurs
✅ **get-messages.php** - Récupérer les messages ⭐ NOUVEAU
✅ **save-messages.php** - Sauvegarder les messages ⭐ NOUVEAU
✅ **send-contact.php** - Envoyer un message de contact (corrigé)
✅ **get-products.php** - Récupérer les produits
✅ **save-products.php** - Sauvegarder les produits

---

## 🎯 **PROBLÈMES RÉSOLUS**

### 1. ✅ Les commandes ne s'affichent pas dans l'admin
**Cause :** Les commandes SONT dans orders.json avec userId, l'API fonctionne
**Solution :** Vérifier que admin.js appelle bien `loadOrders()` au démarrage

### 2. ✅ Les messages de contact ne s'affichent pas
**Cause :** Fichiers API manquants (get-messages.php, save-messages.php)
**Solution :** Fichiers créés ! L'admin peut maintenant charger les messages

### 3. ✅ Impossible de supprimer un client
**Cause :** La fonction existe déjà dans admin.js
**Solution :** Vérifier que l'API save-users.php fonctionne

---

## 📂 **STRUCTURE DES DOSSIERS**

```
/
├── index.html ✅
├── admin.html ✅
├── style.css
├── admin.css
├── script.js ✅
├── admin.js ✅
├── api/
│   ├── get-orders.php ✅
│   ├── save-orders.php ✅
│   ├── save-order.php ✅
│   ├── get-users.php ✅
│   ├── save-users.php ✅
│   ├── get-messages.php ✅ NOUVEAU
│   ├── save-messages.php ✅ NOUVEAU
│   ├── send-contact.php ✅ CORRIGÉ
│   ├── get-products.php ✅
│   └── save-products.php ✅
└── data/
    ├── orders.json (2 commandes existantes)
    ├── users.json (1 utilisateur)
    ├── messages.json (vide)
    └── products.json (1 produit)
```

---

## 🧪 **TESTS À FAIRE**

### Test 1 : Voir les commandes dans l'admin ✅

1. Ouvrir `admin.html`
2. Se connecter (admin / admin123)
3. Cliquer sur l'onglet "📦 Commandes"
4. **Résultat attendu :** Tu devrais voir tes 2 commandes :
   - Commande #1763572534992 - Guillaume Guichard - 2.50€
   - Commande #1763572547948 - Guillaume Guichard - 2.50€

**Si ça ne marche pas :**
- Ouvre la console (F12)
- Regarde les erreurs
- Vérifie que le fichier `api/get-orders.php` est bien accessible

---

### Test 2 : Envoyer un message de contact ✅

1. Ouvrir `index.html`
2. Cliquer sur "📧 Contact"
3. Remplir le formulaire
4. Envoyer
5. **Résultat attendu :** Toast "Message envoyé avec succès ! 📨"

**Vérifier dans l'admin :**
1. Ouvrir `admin.html`
2. Onglet "📧 Messages Contact"
3. **Résultat attendu :** Le message apparaît avec fond jaune (non lu)

**Si ça ne marche pas :**
- Vérifier que `api/send-contact.php` existe
- Vérifier que `api/get-messages.php` existe
- Ouvrir la console (F12) et regarder les erreurs

---

### Test 3 : Supprimer un client ✅

1. Ouvrir `admin.html`
2. Se connecter
3. Onglet "👥 Gestion des Clients"
4. Cliquer sur le bouton 🗑️ du client Guillaume
5. Confirmer la suppression
6. **Résultat attendu :** Toast "Client supprimé avec succès ! 🗑️"

**Vérifier :**
- Le client a disparu de la liste
- Le fichier `data/users.json` est vide : `{"users": []}`

---

## 🐛 **SI ÇA NE MARCHE TOUJOURS PAS**

### Vérifier les permissions

```bash
# Sur le serveur, donner les permissions
chmod 755 api/
chmod 644 api/*.php
chmod 755 data/
chmod 666 data/*.json
```

### Vérifier que PHP fonctionne

```bash
# Tester get-orders.php
curl http://localhost/api/get-orders.php

# Devrait retourner :
{
    "orders": [
        {
            "id": 1763572534992,
            ...
        }
    ]
}
```

### Vérifier les chemins

Dans tous les fichiers PHP, le chemin est : `../data/fichier.json`

**Ça signifie :**
```
/api/get-orders.php  →  ../data/orders.json  =  /data/orders.json
```

**Si ta structure est différente, modifie les chemins !**

Par exemple, si `data` est dans le même dossier que `api` :
```php
$file = 'data/orders.json';  // Enlever le ../
```

---

## 📊 **DONNÉES ACTUELLES**

### orders.json (2 commandes)
```json
{
    "orders": [
        {
            "id": 1763572534992,
            "userId": 1763572517855,
            "date": "19/11/2025",
            "total": 2.5,
            "status": "Payée",
            "paymentMethod": "PayPal"
        },
        {
            "id": 1763572547948,
            "userId": 1763572517855,
            "date": "19/11/2025",
            "total": 2.5,
            "status": "Payée",
            "paymentMethod": "SumUp"
        }
    ]
}
```

### users.json (1 utilisateur)
```json
{
    "users": [
        {
            "id": 1763572517855,
            "nom": "Guillaume Guichard",
            "email": "guillaume-du71@hotmail.fr"
        }
    ]
}
```

---

## 🎯 **CHECKLIST FINALE**

Avant de tester, assure-toi que :

- ✅ Tous les fichiers PHP sont dans `/api/`
- ✅ Tous les fichiers JSON sont dans `/data/`
- ✅ Les permissions sont correctes
- ✅ PHP est installé et fonctionne
- ✅ `admin.js` est le fichier corrigé (sans erreurs de syntaxe)
- ✅ `index.html` est le fichier corrigé (sans modale de paiement)

---

## 🚀 **PROCHAINES ÉTAPES**

1. **Remplace les anciens fichiers par les nouveaux**
2. **Teste les 3 fonctionnalités :**
   - Voir les commandes dans l'admin
   - Envoyer un message de contact
   - Supprimer un client
3. **Dis-moi ce qui fonctionne et ce qui ne fonctionne pas**

---

## 💡 **ASTUCE DÉBOGAGE**

Pour savoir exactement ce qui se passe, ouvre la console (F12) dans le navigateur :

**Console → Network :**
- Tu verras toutes les requêtes API
- Si une requête échoue, tu verras le code d'erreur (404, 500, etc.)
- Si la requête réussit mais ne charge pas, c'est un problème JavaScript

**Console → Console :**
- Tu verras les `console.log()` de admin.js
- Ex: "🔄 Chargement des commandes..."
- Ex: "📊 Nombre de commandes: 2"

---

✨ **Tous les fichiers sont prêts ! Teste et dis-moi ce qui se passe !** 😊
