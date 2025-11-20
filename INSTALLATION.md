# 🚀 GUIDE D'INSTALLATION COMPLET
## Pois De Senteurs By Julie - Version 2.0

---

## 📦 STRUCTURE COMPLÈTE DU PROJET

```
POIS-DE-SENTEURS/
│
├── index.html                 ✅ Page principale (MODIFIÉ)
├── style.css                  ✅ Styles CSS (MODIFIÉ)
├── script.js                  ✅ JavaScript (MODIFIÉ)
│
├── api/                       📁 Dossier API PHP
│   ├── get-products.php       ✅ Récupérer les produits
│   ├── save-products.php      ✅ Sauvegarder les produits
│   ├── get-users.php          ✅ Récupérer les utilisateurs
│   ├── save-users.php         ✅ Sauvegarder les utilisateurs
│   ├── get-orders.php         ✅ Récupérer les commandes
│   ├── save-orders.php        ✅ Sauvegarder toutes les commandes
│   ├── save-order.php         ✅ Sauvegarder une commande
│   └── send-contact.php       ✅ Envoyer un message contact (CORRIGÉ)
│
└── data/                      📁 Dossier Base de données JSON
    ├── products.json          ✅ Base de données produits
    ├── users.json             ✅ Base de données utilisateurs
    ├── orders.json            ✅ Base de données commandes
    └── messages.json          ✅ Base de données messages contact (NOUVEAU)
```

---

## 📋 ÉTAPE 1 : PRÉPARATION

### 1.1 Vérifier les prérequis
- ✅ Serveur web (Apache, Nginx, ou XAMPP/WAMP)
- ✅ PHP 7.4+ installé
- ✅ Permissions d'écriture sur le serveur

### 1.2 Sauvegarder l'ancien site
```bash
# Faire une copie de sauvegarde
cp -r /chemin/vers/ancien-site /chemin/vers/ancien-site-backup
```

---

## 📋 ÉTAPE 2 : INSTALLATION DES FICHIERS

### 2.1 Copier les fichiers principaux
```bash
# Remplacer les 3 fichiers principaux
cp index.html /chemin/vers/votre/site/
cp style.css /chemin/vers/votre/site/
cp script.js /chemin/vers/votre/site/
```

### 2.2 Installer le dossier API
```bash
# Copier tout le dossier api/
cp -r api/ /chemin/vers/votre/site/
```

### 2.3 Installer le dossier DATA
```bash
# Copier tout le dossier data/
cp -r data/ /chemin/vers/votre/site/
```

---

## 📋 ÉTAPE 3 : CONFIGURATION DES PERMISSIONS

### 3.1 Permissions sur les dossiers
```bash
# Donner les droits d'écriture au dossier data/
chmod 755 /chemin/vers/votre/site/data/
chmod 644 /chemin/vers/votre/site/data/*.json
```

### 3.2 Vérifier les permissions PHP
```bash
# Le serveur web doit pouvoir écrire dans data/
chown www-data:www-data /chemin/vers/votre/site/data/
chown www-data:www-data /chemin/vers/votre/site/data/*.json
```

---

## 📋 ÉTAPE 4 : CONFIGURATION PHP

### 4.1 Vérifier php.ini
```ini
# S'assurer que ces paramètres sont actifs
file_uploads = On
post_max_size = 20M
upload_max_filesize = 20M
```

### 4.2 Tester PHP
```bash
# Créer un fichier test.php à la racine
echo "<?php phpinfo(); ?>" > test.php

# Ouvrir dans le navigateur
http://votre-site.com/test.php

# Vérifier que PHP fonctionne, puis supprimer
rm test.php
```

---

## 📋 ÉTAPE 5 : MIGRATION DES DONNÉES

### 5.1 Migrer les produits existants

Si tu as déjà des produits dans `localStorage` :

**Option A : Via la console du navigateur**
```javascript
// Ouvrir la console (F12)
// Copier les produits
let products = JSON.parse(localStorage.getItem('products')) || [];
console.log(JSON.stringify({products: products}, null, 2));

// Copier le résultat et le coller dans data/products.json
```

**Option B : Script de migration automatique**
```javascript
// Ajouter temporairement dans script.js
function migrateToAPI() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    fetch('api/save-products.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({products: products})
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Produits migrés:', data);
        showToast('Produits migrés avec succès !', 'success');
    });
}

// Appeler une seule fois dans la console
migrateToAPI();
```

### 5.2 Migrer les utilisateurs
```javascript
function migrateUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    fetch('api/save-users.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({users: users})
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Utilisateurs migrés:', data);
        showToast('Utilisateurs migrés avec succès !', 'success');
    });
}
```

### 5.3 Migrer les commandes
```javascript
function migrateOrders() {
    // Récupérer toutes les commandes de tous les utilisateurs
    let allOrders = [];
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.forEach(user => {
        const userOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`)) || [];
        userOrders.forEach(order => {
            allOrders.push({...order, userId: user.id});
        });
    });
    
    fetch('api/save-orders.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({orders: allOrders})
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Commandes migrées:', data);
        showToast('Commandes migrées avec succès !', 'success');
    });
}
```

---

## 📋 ÉTAPE 6 : TESTS

### 6.1 Test des API PHP

**Test 1 : Lire les produits**
```bash
curl http://votre-site.com/api/get-products.php
```
Résultat attendu : `{"products":[]}`

**Test 2 : Sauvegarder un produit**
```bash
curl -X POST http://votre-site.com/api/save-products.php \
  -H "Content-Type: application/json" \
  -d '{"products":[{"id":1,"name":"Test","price":10}]}'
```
Résultat attendu : `{"success":true,"message":"Produits sauvegardés"}`

**Test 3 : Contact**
```bash
curl -X POST http://votre-site.com/api/send-contact.php \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","email":"test@test.com","subject":"Test","message":"Hello"}'
```
Résultat attendu : `{"success":true,"message":"Message enregistré avec succès"}`

### 6.2 Tests dans le navigateur

1. **Test Toast Notifications**
   - Ajouter un produit au panier → Toast vert ✅
   - Modifier le profil → Toast vert ✅
   - Erreur de connexion → Toast rouge ✅

2. **Test Contact**
   - Cliquer "📧 Contact"
   - Remplir le formulaire
   - Envoyer
   - Vérifier dans `data/messages.json`

3. **Test Déconnexion**
   - Se connecter
   - Aller dans Profil
   - Cliquer "🚪 Déconnexion"
   - Vérifier la déconnexion

4. **Test Synchronisation**
   - Ouvrir 2 onglets
   - Modifier dans l'onglet 1
   - Attendre 30 secondes
   - Vérifier dans l'onglet 2

---

## 📋 ÉTAPE 7 : CONFIGURATION SERVEUR

### 7.1 Apache (.htaccess)

Créer un fichier `.htaccess` à la racine :
```apache
# Protection des fichiers JSON
<FilesMatch "\.(json)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>

# Permettre l'accès aux API PHP
<Directory "api">
    Allow from all
</Directory>

# Redirection HTTPS (optionnel)
# RewriteEngine On
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 7.2 Nginx (nginx.conf)

Ajouter dans la config :
```nginx
# Bloquer l'accès aux fichiers JSON
location ~* \.json$ {
    deny all;
}

# Autoriser les API PHP
location /api/ {
    try_files $uri =404;
    fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
}
```

---

## 📋 ÉTAPE 8 : SÉCURITÉ

### 8.1 Protéger les fichiers sensibles
```bash
# Créer un fichier .htaccess dans data/
echo "Deny from all" > data/.htaccess
```

### 8.2 Vérifier les permissions
```bash
# Fichiers JSON : lecture/écriture serveur uniquement
chmod 640 data/*.json

# Dossier data : accès serveur uniquement
chmod 750 data/
```

### 8.3 Backup automatique (recommandé)

Créer un script de backup :
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/pois-de-senteurs"

mkdir -p $BACKUP_DIR

# Backup des données
tar -czf $BACKUP_DIR/data_$DATE.tar.gz data/

# Garder seulement les 30 derniers backups
ls -t $BACKUP_DIR/data_*.tar.gz | tail -n +31 | xargs rm -f

echo "✅ Backup créé : data_$DATE.tar.gz"
```

Ajouter au cron :
```bash
# Backup quotidien à 3h du matin
0 3 * * * /chemin/vers/backup.sh
```

---

## 📋 ÉTAPE 9 : OPTIMISATION

### 9.1 Cache des fichiers JSON
```php
// Ajouter dans chaque get-*.php
header('Cache-Control: public, max-age=300'); // 5 minutes
```

### 9.2 Compression GZIP
```apache
# Dans .htaccess
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

### 9.3 Minification (production)
```bash
# Installer les outils
npm install -g uglify-js clean-css-cli html-minifier

# Minifier
uglifyjs script.js -o script.min.js
cleancss -o style.min.css style.css
html-minifier --collapse-whitespace index.html -o index.min.html
```

---

## 🐛 RÉSOLUTION DE PROBLÈMES

### Problème 1 : "Permission denied" dans data/
```bash
# Solution
chmod 755 data/
chmod 644 data/*.json
chown -R www-data:www-data data/
```

### Problème 2 : API PHP ne répond pas
```bash
# Vérifier que PHP fonctionne
php -v

# Vérifier les logs Apache
tail -f /var/log/apache2/error.log

# Vérifier les logs PHP
tail -f /var/log/php7.4-fpm.log
```

### Problème 3 : CORS errors
```php
// Ajouter dans chaque fichier PHP
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

### Problème 4 : Messages de contact ne s'enregistrent pas
```bash
# Vérifier les permissions
ls -la data/messages.json

# Vérifier le contenu
cat data/messages.json

# Tester manuellement
curl -X POST http://localhost/api/send-contact.php \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","email":"test@test.com","message":"Test"}'
```

---

## 📊 MONITORING

### Logs à surveiller
```bash
# Messages de contact
tail -f data/messages.json

# Commandes
tail -f data/orders.json

# Logs PHP
tail -f /var/log/php7.4-fpm.log

# Logs Apache
tail -f /var/log/apache2/access.log
```

---

## ✅ CHECKLIST FINALE

- [ ] Tous les fichiers copiés
- [ ] Permissions configurées
- [ ] PHP fonctionnel
- [ ] API testées
- [ ] Données migrées
- [ ] Toast notifications fonctionnelles
- [ ] Bouton déconnexion fonctionnel
- [ ] Page contact fonctionnelle
- [ ] Synchronisation active
- [ ] Backup configuré
- [ ] Sécurité vérifiée

---

## 🎉 FÉLICITATIONS !

Ton site est maintenant :
- ✨ Plus moderne avec les Toast notifications
- 🚪 Plus intuitif avec la déconnexion facile
- 📧 Plus professionnel avec le formulaire contact
- ⏱️ Plus dynamique avec la synchronisation temps réel

---

## 📞 SUPPORT

En cas de problème :
1. Vérifier les logs (voir section Monitoring)
2. Tester les API individuellement
3. Vérifier les permissions des fichiers
4. Consulter la documentation PHP de ton hébergeur

---

✨ **Bon succès avec ton site !** 🌸
