# 📧 SYSTÈME DE RÉPONSE AUX MESSAGES CLIENT

## ✅ **FONCTIONNALITÉ AJOUTÉE**

Tu peux maintenant **répondre directement aux messages des clients** depuis l'admin, sans passer par un logiciel email !

---

## 🎯 **COMMENT ÇA FONCTIONNE**

### **Étape 1 : Recevoir un message**
1. Un client remplit le formulaire de contact sur `index.html`
2. Le message est enregistré dans `data/messages.json`
3. Le message apparaît dans l'admin avec un fond **jaune** (non lu)

### **Étape 2 : Répondre au message**
1. Va dans l'admin → Onglet "📧 Messages Contact"
2. Clique sur le bouton **"📧 Répondre"** du message
3. Une modale s'ouvre avec :
   - Les informations du client (nom, email)
   - Le sujet original
   - Un champ de texte pour écrire ta réponse
   - Le message original (en détails déroulants)
4. Écris ta réponse
5. Clique sur **"📨 Envoyer la réponse"**
6. L'email est envoyé automatiquement au client ! ✅

---

## 📨 **CE QUE REÇOIT LE CLIENT**

Le client recevra un **email HTML professionnel** avec :
- ✅ Un en-tête "Pois de Senteurs By Julie"
- ✅ Ta réponse dans un joli design
- ✅ Une signature automatique
- ✅ Les coordonnées de contact

**Exemple d'email :**
```
┌─────────────────────────────────────┐
│  🌸 Pois de Senteurs By Julie       │
├─────────────────────────────────────┤
│                                     │
│  Bonjour Marie,                     │
│                                     │
│  Merci de nous avoir contactés.    │
│  Voici notre réponse :              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Ta réponse ici]            │   │
│  └─────────────────────────────┘   │
│                                     │
│  Cordialement,                      │
│  L'équipe Pois de Senteurs By Julie│
│                                     │
├─────────────────────────────────────┤
│  📧 contact@poisdesenteurs.com      │
│  🌐 www.poisdesenteurs.com          │
└─────────────────────────────────────┘
```

---

## 📂 **FICHIERS MODIFIÉS/CRÉÉS**

### **Fichiers modifiés :**
- ✅ `admin.html` - Ajout de la modale de réponse
- ✅ `admin.js` - Ajout des fonctions `openReplyModal()`, `sendReply()`, etc.

### **Nouveaux fichiers :**
- ✅ `api/send-reply.php` - Envoi des emails de réponse
- ✅ `data/replies-log.json` - Historique des réponses envoyées (créé automatiquement)

---

## 🔧 **CONFIGURATION EMAIL**

### **Important : Configuration du serveur email**

Pour que les emails fonctionnent, ton serveur doit être configuré pour envoyer des emails PHP.

#### **Option 1 : Serveur avec PHP mail() activé**
Si ton hébergeur supporte `mail()` (la plupart le font), ça devrait fonctionner directement ! ✅

#### **Option 2 : Utiliser SMTP (plus fiable)**
Si `mail()` ne fonctionne pas, on peut utiliser PHPMailer avec SMTP (Gmail, SendGrid, etc.)

**Test si mail() fonctionne :**
```bash
php -r "mail('ton@email.com', 'Test', 'Test message');"
```

---

## 📊 **SUIVI DES RÉPONSES**

Toutes les réponses envoyées sont enregistrées dans `data/replies-log.json` :

```json
{
    "replies": [
        {
            "id": 1763572600000,
            "originalMessageId": 1763572534992,
            "to": "client@email.com",
            "toName": "Marie Dupont",
            "subject": "Re: Question sur un produit",
            "message": "Bonjour Marie, voici ma réponse...",
            "sentDate": "20/11/2025 10:30:00",
            "status": "sent"
        }
    ]
}
```

---

## 🎨 **PERSONNALISATION**

### **Changer l'email expéditeur**
Dans `api/send-reply.php`, ligne 18-19 :
```php
$headers = "From: Pois de Senteurs By Julie <noreply@poisdesenteurs.com>\r\n";
$headers .= "Reply-To: contact@poisdesenteurs.com\r\n";
```

**Remplace par ton vrai email :**
```php
$headers = "From: Julie <julie@poisdesenteurs.com>\r\n";
$headers .= "Reply-To: julie@poisdesenteurs.com\r\n";
```

### **Changer le design de l'email**
Modifie le HTML dans `api/send-reply.php`, lignes 24-63

---

## 🧪 **TESTER LE SYSTÈME**

### **Test complet :**

1. **Envoyer un message de test**
   - Va sur `index.html`
   - Clique "📧 Contact"
   - Remplis avec TON email (pour recevoir la réponse)
   - Envoie

2. **Répondre depuis l'admin**
   - Va sur `admin.html`
   - Onglet "📧 Messages Contact"
   - Clique "📧 Répondre" sur ton message
   - Écris une réponse de test
   - Envoie

3. **Vérifier la réception**
   - Regarde ta boîte email
   - Tu devrais avoir reçu la réponse ! 📨

---

## 🐛 **RÉSOLUTION DE PROBLÈMES**

### **"Erreur lors de l'envoi de l'email"**

**Cause 1 : mail() désactivé**
```bash
# Vérifier si mail() est activé
php -i | grep mail

# Solution : Activer dans php.ini
sendmail_path = /usr/sbin/sendmail -t -i
```

**Cause 2 : Pas de serveur SMTP**
Solution : Utiliser un service tiers (Gmail SMTP, SendGrid, Mailgun)

**Cause 3 : Emails considérés comme spam**
Solution : 
- Configurer SPF, DKIM, DMARC sur ton domaine
- Utiliser un vrai email expéditeur (pas noreply)

### **"Toast 'Réponse envoyée' mais email pas reçu"**

1. Vérifie les **spams/indésirables**
2. Vérifie les logs du serveur :
```bash
tail -f /var/log/mail.log
```

3. Teste avec un autre email

### **Impossible de cliquer sur "Répondre"**

1. Recharge la page (Ctrl+F5)
2. Vérifie la console (F12)
3. Assure-toi que `admin.js` est à jour

---

## ✨ **AMÉLIORATIONS POSSIBLES**

Si tu veux aller plus loin, on peut ajouter :

1. **Pièces jointes** - Joindre des fichiers aux réponses
2. **Templates de réponse** - Réponses pré-écrites pour les questions fréquentes
3. **Historique des échanges** - Voir toutes les réponses envoyées à un client
4. **Notifications** - Badge avec le nombre de messages non lus
5. **Statut "Répondu"** - Badge vert sur les messages avec réponse
6. **Signature HTML** - Ajouter un logo dans l'email

---

## 📥 **FICHIERS À TÉLÉCHARGER**

- [admin.html](computer:///mnt/user-data/outputs/admin.html) ✅
- [admin.js](computer:///mnt/user-data/outputs/admin.js) ✅
- [send-reply.php](computer:///mnt/user-data/outputs/api/send-reply.php) ✅

---

## 🎯 **RÉSUMÉ**

✅ Système de réponse intégré dans l'admin
✅ Emails HTML professionnels
✅ Historique des réponses
✅ Interface simple et intuitive
✅ Aucun logiciel email externe nécessaire

**Prêt à répondre à tes clients ! 📧💬**
