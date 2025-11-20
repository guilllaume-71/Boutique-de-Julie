# ⚡ DÉMARRAGE RAPIDE - 5 MINUTES

## 🎯 CE QUI A ÉTÉ FAIT

✅ Réponse aux messages clients depuis l'admin
✅ Personnalisation des couronnes (tailles 20/30/40cm + options)
✅ Personnalisation des bracelets (tailles + choix fleurs)
✅ Personnalisation des peignes et bijoux
✅ Calcul automatique des prix avec options
✅ Affichage complet dans le panier

---

## ⚡ INSTALLATION EN 5 ÉTAPES

### 1️⃣ Remplacer 4 fichiers (2 min)
Remplacez vos fichiers actuels par les nouveaux :
```
✅ products.json
✅ admin.html
✅ admin.js
✅ script.js
```

### 2️⃣ Créer le dossier API (1 min)
```bash
mkdir api
mv send-reply.php api/
```

### 3️⃣ Configurer votre email (30 sec)
Ouvrir `api/send-reply.php` ligne 53 :
```php
$from = "votre-email@poisdesenteurs.com"; // ← CHANGER ICI
```

### 4️⃣ Tester côté client (1 min)
1. Ouvrir votre site
2. Cliquer sur "Ajouter au panier" sur la Couronne
3. Choisir vos options
4. Vérifier le panier

### 5️⃣ Tester côté admin (30 sec)
1. Aller dans l'admin → Messages
2. Cliquer sur "📧 Répondre"
3. Envoyer une réponse
4. Vérifier l'email reçu

---

## 📦 CE QUE VOUS AVEZ REÇU

### Fichiers à utiliser
- **products.json** - Base de données avec options
- **admin.html** - Interface admin avec réponse messages
- **admin.js** - Logique admin
- **script.js** - Logique client avec personnalisation
- **send-reply.php** - API envoi emails (dans `api/`)

### Documentation
- **LIVRAISON-FINALE.md** - Récapitulatif complet
- **README-MISE-A-JOUR.md** - Guide détaillé
- **EXEMPLES-PRODUITS.md** - 7 produits à copier-coller

---

## 🎨 EXEMPLE : COURONNE

**Le client voit :**
```
🌸 Couronne fleurs séchées - 25€

[Ajouter au panier] ← Clic ici
```

**Modale qui s'ouvre :**
```
┌─────────────────────────────────────┐
│ ✨ Personnaliser votre produit       │
│                                     │
│ Prix de base : 25€                  │
│ Prix total : 48€                    │
│                                     │
│ 📏 Taille *                         │
│  ○ 20 cm                            │
│  ⦿ 30 cm (+10€)                     │
│  ○ 40 cm (+20€)                     │
│                                     │
│ 💬 Personnalisation texte           │
│  [Joyeux anniversaire Marie___]    │
│  (+5€)                              │
│                                     │
│ 🌸 Fleurs séchées supplémentaires   │
│  ☑ Ajouter (+8€)                    │
│                                     │
│ [✅ Ajouter au panier] [❌ Annuler]  │
└─────────────────────────────────────┘
```

**Dans le panier :**
```
🌸 Couronne fleurs séchées
┌─────────────────────────────────────┐
│ 📏 Taille : 30 cm                   │
│ 💬 Texte : Joyeux anniversaire Marie│
│ 🌸 Fleurs séchées : Oui             │
└─────────────────────────────────────┘
25€ 48€ × 1
```

---

## 📧 EXEMPLE : RÉPONSE MESSAGE

**Dans l'admin :**
```
Messages de Contact
┌──────────────────────────────────────────────────┐
│ Date      │ Nom   │ Email         │ Sujet    │   │
│ 20/11     │ Marie │ marie@...     │ Question │ Actions │
│                                    [👁️ Voir]     │
│                                    [📧 Répondre]  │
│                                    [🗑️ Supprimer] │
└──────────────────────────────────────────────────┘
```

**Clic sur [📧 Répondre] :**
```
┌─────────────────────────────────────────────┐
│ 📧 Répondre au message                       │
│                                             │
│ Message original de Marie                   │
│ Email : marie@example.com                   │
│ ─────────────────────────────────────────   │
│ "Bonjour, avez-vous des couronnes en 25cm?"│
│                                             │
│ Sujet : [Re: Question_____________]         │
│                                             │
│ Votre réponse :                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Bonjour Marie,                          │ │
│ │                                         │ │
│ │ Oui, nous pouvons faire des couronnes   │ │
│ │ de 25cm sur mesure. Le prix serait...   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [📧 Envoyer] [❌ Annuler]                    │
└─────────────────────────────────────────────┘
```

**Email que Marie reçoit :**
```
De: Pois de Senteurs By Julie
À: marie@example.com
Sujet: Re: Question

┌──────────────────────────────────────────┐
│      🌸 Pois de Senteurs By Julie        │
├──────────────────────────────────────────┤
│                                          │
│ Bonjour Marie,                           │
│                                          │
│ Merci pour votre message ! Voici notre   │
│ réponse :                                │
│ ────────────────────────────────────────  │
│ Oui, nous pouvons faire des couronnes    │
│ de 25cm sur mesure. Le prix serait...    │
│ ────────────────────────────────────────  │
│                                          │
│ Votre message original :                 │
│ "Bonjour, avez-vous des couronnes        │
│  en 25cm?"                               │
│                                          │
│ Cordialement,                            │
│ L'équipe Pois de Senteurs                │
└──────────────────────────────────────────┘
```

---

## ✅ CHECKLIST ULTRA-RAPIDE

```
□ Remplacer products.json
□ Remplacer admin.html
□ Remplacer admin.js
□ Remplacer script.js
□ Créer dossier api/
□ Placer send-reply.php dans api/
□ Configurer email dans send-reply.php ligne 53
□ Tester couronne → modale s'ouvre
□ Tester panier → options affichées
□ Tester admin → bouton Répondre fonctionne
□ Tester email → reçu par le client
```

---

## ⚠️ IMPORTANT À NE PAS OUBLIER

1. **Configurer l'email** dans send-reply.php
2. **Créer le dossier `api/`** 
3. **Placer send-reply.php dedans**

Si vous oubliez l'étape 3, les réponses ne partiront pas !

---

## 🆘 PROBLÈME ?

### La modale ne s'ouvre pas
```bash
# Vider le cache
Ctrl + F5

# Vérifier la console
F12 → Console
```

### Les emails ne partent pas
```bash
# Vérifier que le fichier existe
ls api/send-reply.php

# Vérifier l'email configuré
cat api/send-reply.php | grep '$from'
```

### Les options ne s'affichent pas
```javascript
// Console navigateur (F12)
localStorage.clear();
location.reload();
```

---

## 📖 POUR EN SAVOIR PLUS

Consultez les fichiers de documentation :
- **LIVRAISON-FINALE.md** - Tout ce qui a été fait
- **README-MISE-A-JOUR.md** - Guide complet
- **EXEMPLES-PRODUITS.md** - Ajouter plus de produits

---

## 🎉 C'EST FAIT !

En 5 minutes, votre site a maintenant :
✅ Personnalisation complète
✅ Réponse aux clients
✅ Calcul automatique des prix

**Bon courage ! 🌸**
