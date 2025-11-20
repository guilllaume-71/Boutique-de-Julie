# 🌸 Pois de Senteurs By Julie - Mise à jour complète

## 📋 RÉSUMÉ DES MODIFICATIONS

Cette mise à jour apporte 3 fonctionnalités majeures :

### 1️⃣ **Système de réponse aux messages clients** ✅
### 2️⃣ **Personnalisation avancée des produits** ✅
### 3️⃣ **Gestion des prix dynamiques** ✅

---

## 📦 FICHIERS MODIFIÉS

1. **products.json** - Base de données produits avec options de personnalisation
2. **admin.html** - Interface admin avec modale de réponse
3. **admin.js** - Gestion des réponses aux messages
4. **index.html** - Pas de modification majeure (structure existante)
5. **script.js** - Modale de personnalisation + affichage panier amélioré
6. **send-reply.php** - **NOUVEAU** - API pour envoyer les réponses par email

---

## 🎯 FONCTIONNALITÉ 1 : RÉPONSE AUX MESSAGES

### Comment ça marche ?

**Dans l'admin :**
1. Aller dans l'onglet "📧 Messages Contact"
2. Cliquer sur le bouton **"📧 Répondre"** sur un message
3. Une modale s'ouvre avec :
   - Le message original du client
   - Un champ "Sujet" pré-rempli avec "Re: [sujet original]"
   - Un champ de texte pour écrire la réponse
4. Cliquer sur **"📧 Envoyer la réponse"**
5. Le client reçoit un email formaté avec :
   - Votre réponse
   - Son message original
   - Le design Pois de Senteurs

### Configuration requise

**⚠️ IMPORTANT : Configuration de l'email dans send-reply.php**

Ouvrez le fichier `send-reply.php` et modifiez la ligne 53 :

```php
$from = "noreply@poisdesenteurs.com"; // ← Changez avec votre vrai email
```

Mettez votre vrai email (ex: `julie@poisdesenteurs.com`)

### Fichiers concernés
- `admin.html` : Modale de réponse ajoutée
- `admin.js` : Fonctions `openReplyModal()`, `closeReplyModal()` et gestion du formulaire
- `send-reply.php` : API d'envoi d'emails

---

## 🎨 FONCTIONNALITÉ 2 : PERSONNALISATION DES PRODUITS

### Produits concernés

#### 🌸 **COURONNES**
- **Tailles disponibles :**
  - 20 cm (prix de base)
  - 30 cm (+10€)
  - 40 cm (+20€)
- **Options :**
  - Personnalisation texte (+5€)
  - Fleurs séchées supplémentaires (+8€)

#### 💍 **BRACELETS**
- **Tailles :**
  - 16 cm (petit)
  - 18 cm (standard)
  - 20 cm (grand)
- **Choix des fleurs :**
  - Lavande (gratuit)
  - Rose (+2€)
  - Gypsophile (gratuit)
  - Eucalyptus (+1€)
  - Mélange (+3€)

#### 🎀 **PEIGNES**
- **Couleurs :**
  - Naturel (gratuit)
  - Doré (+3€)
  - Argenté (+3€)
- **Type de fleurs** (optionnel, texte libre)

#### 💎 **BIJOUX** (Boucles d'oreilles, Colliers, etc.)
- **Matériaux :**
  - Argent 925 (prix de base)
  - Plaqué or (+5€)
- **Choix des fleurs** (optionnel, texte libre)

### Comment ça marche côté client ?

1. Le client clique sur **"Ajouter au panier"**
2. Une modale de personnalisation s'ouvre automatiquement
3. Le client choisit ses options
4. Le **prix total se calcule en temps réel**
5. Validation → ajout au panier avec toutes les options

### Structure dans products.json

```json
{
    "id": 1763646176448,
    "name": "Couronne fleurs séchées",
    "price": 25,
    "customizable": true,
    "options": {
        "size": {
            "label": "Taille",
            "required": true,
            "choices": [
                {"value": "20cm", "label": "20 cm", "priceModifier": 0},
                {"value": "30cm", "label": "30 cm", "priceModifier": 10},
                {"value": "40cm", "label": "40 cm", "priceModifier": 20}
            ]
        },
        "text": {
            "label": "Personnalisation texte",
            "required": false,
            "type": "text",
            "placeholder": "Votre texte personnalisé (optionnel)",
            "priceModifier": 5
        },
        "driedFlowers": {
            "label": "Fleurs séchées supplémentaires",
            "required": false,
            "type": "checkbox",
            "priceModifier": 8
        }
    }
}
```

### Ajouter d'autres produits personnalisables

Pour ajouter un nouveau produit avec personnalisation :

1. Ouvrir `products.json`
2. Ajouter `"customizable": true`
3. Ajouter un objet `"options"` avec vos choix
4. Types d'options possibles :
   - **Radio buttons** : `choices` avec array
   - **Input texte** : `type: "text"`
   - **Select** : `type: "select"` + `choices`
   - **Checkbox** : `type: "checkbox"`

---

## 💰 FONCTIONNALITÉ 3 : CALCUL PRIX DYNAMIQUE

### Comment ça marche ?

1. **Prix de base** : défini dans `product.price`
2. **Modificateurs** : définis dans chaque option avec `priceModifier`
3. **Calcul automatique** : addition de tous les modificateurs
4. **Affichage temps réel** : dans la modale de personnalisation

### Exemple de calcul

**Couronne 30cm avec texte et fleurs :**
```
Prix de base :           25€
Taille 30cm :          +10€
Texte personnalisé :    +5€
Fleurs supplémentaires: +8€
─────────────────────────────
TOTAL :                 48€
```

### Affichage dans le panier

Le panier affiche :
- **Nom du produit**
- **Toutes les personnalisations** avec icônes
- **Prix barré** (prix de base) si différent
- **Prix final** en gras

---

## 📂 STRUCTURE DES DOSSIERS

```
📁 votre-site/
├── 📄 index.html (client)
├── 📄 admin.html (admin)
├── 📄 script.js (logique client)
├── 📄 admin.js (logique admin)
├── 📄 style.css (existant)
├── 📄 products.json (base de données)
│
└── 📁 api/
    └── 📄 send-reply.php (envoi emails) ← À CRÉER
```

**⚠️ ATTENTION : Créez le dossier `api/` et placez `send-reply.php` dedans**

---

## 🚀 INSTALLATION

### Étape 1 : Remplacer les fichiers
Remplacez ces fichiers par les nouveaux :
- ✅ `products.json`
- ✅ `admin.html`
- ✅ `admin.js`
- ✅ `script.js`

### Étape 2 : Ajouter send-reply.php
1. Créer un dossier `api/` à la racine
2. Placer `send-reply.php` dans ce dossier
3. **Modifier l'email ligne 53** avec votre vrai email

### Étape 3 : Configurer l'envoi d'emails
Si votre hébergement n'utilise pas la fonction `mail()` de PHP :

#### Option A : Utiliser SMTP (recommandé)
Installer PHPMailer :
```bash
composer require phpmailer/phpmailer
```

Modifier `send-reply.php` pour utiliser SMTP (Gmail, Outlook, etc.)

#### Option B : Service externe
- SendGrid
- Mailgun
- Amazon SES

### Étape 4 : Tester
1. Aller sur le site client
2. Ajouter une couronne au panier → modale de personnalisation
3. Aller dans l'admin → Messages
4. Répondre à un message → vérifier l'email

---

## 🔧 PERSONNALISATION AVANCÉE

### Modifier les couleurs de la modale
Dans `script.js`, ligne ~367 dans `openCustomizationModal()` :

```javascript
// Changer la couleur principale
"color: #8B4789;" // ← Modifier ici
```

### Ajouter de nouveaux types d'options
Exemple : Liste déroulante multi-sélection

```json
"accessories": {
    "label": "Accessoires",
    "required": false,
    "type": "multiselect",
    "choices": [
        {"value": "ruban", "label": "Ruban", "priceModifier": 3},
        {"value": "perles", "label": "Perles", "priceModifier": 5}
    ]
}
```

Il faudra ensuite ajouter le support dans `openCustomizationModal()`.

---

## ❓ FAQ

### Q1 : Les emails ne partent pas ?
**R :** Vérifiez :
1. Que `send-reply.php` est dans `api/`
2. Que votre email est configuré ligne 53
3. Que votre serveur autorise `mail()`
4. Les logs dans `api/logs/replies.log`

### Q2 : Comment ajouter plus de fleurs dans les bracelets ?
**R :** Dans `products.json`, trouvez le bracelet et ajoutez dans `flowers.choices` :
```json
{"value": "jasmin", "label": "Jasmin", "priceModifier": 2}
```

### Q3 : Comment rendre une option obligatoire ?
**R :** Mettre `"required": true` dans l'option

### Q4 : Les personnalisations ne s'affichent pas dans le panier ?
**R :** Videz le cache du navigateur (Ctrl+F5) et rechargez

### Q5 : Où voir les messages envoyés ?
**R :** Dans `api/logs/replies.log` (créé automatiquement)

---

## 📊 STATISTIQUES & SUIVI

### Logs disponibles
- **Emails envoyés** : `api/logs/replies.log`
- **Format** : `[Date] - Réponse envoyée à [email] (Sujet: [sujet])`

### À venir (futures améliorations)
- [ ] Historique des réponses dans l'admin
- [ ] Templates de réponses pré-enregistrés
- [ ] Notifications en temps réel
- [ ] Export des commandes avec personnalisations

---

## 🛡️ SÉCURITÉ

### Protection XSS
Tous les inputs sont protégés avec `htmlspecialchars()` dans `send-reply.php`

### Validation email
Utilisation de `filter_var($email, FILTER_VALIDATE_EMAIL)`

### CORS
Headers configurés pour accepter les requêtes depuis votre domaine

---

## 📞 SUPPORT

Si vous avez des questions ou des bugs :
1. Vérifier les logs dans `api/logs/`
2. Console navigateur (F12)
3. Vérifier la configuration email

---

## ✅ CHECKLIST DE DÉPLOIEMENT

- [ ] Remplacer `products.json`
- [ ] Remplacer `admin.html`
- [ ] Remplacer `admin.js`
- [ ] Remplacer `script.js`
- [ ] Créer dossier `api/`
- [ ] Ajouter `send-reply.php`
- [ ] Configurer email ligne 53
- [ ] Tester personnalisation client
- [ ] Tester réponse aux messages
- [ ] Vérifier affichage panier
- [ ] Vérifier emails reçus

---

## 🎉 C'EST TERMINÉ !

Votre site Pois de Senteurs dispose maintenant de :
- ✅ Système de réponse aux messages professionnels
- ✅ Personnalisation complète des produits
- ✅ Calcul de prix dynamique
- ✅ Affichage amélioré du panier

**Bon courage pour la suite ! 🌸**
