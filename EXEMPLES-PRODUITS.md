# 📦 Exemples de Produits Personnalisables

Ce fichier contient des exemples de produits avec personnalisation que vous pouvez copier-coller dans votre `products.json`.

---

## 🌸 COURONNE FLEURS FRAÎCHES

```json
{
    "id": 1763646176449,
    "name": "Couronne fleurs fraîches",
    "category": "couronnes",
    "price": 35,
    "stock": 20,
    "image": "images/couronne-fraiche.jpg",
    "description": "Magnifique couronne de fleurs fraîches",
    "customizable": true,
    "options": {
        "size": {
            "label": "Taille",
            "required": true,
            "choices": [
                {"value": "20cm", "label": "20 cm", "priceModifier": 0},
                {"value": "30cm", "label": "30 cm", "priceModifier": 15},
                {"value": "40cm", "label": "40 cm", "priceModifier": 25}
            ]
        },
        "flowers": {
            "label": "Type de fleurs",
            "required": true,
            "type": "select",
            "choices": [
                {"value": "roses", "label": "Roses", "priceModifier": 5},
                {"value": "pivoines", "label": "Pivoines", "priceModifier": 8},
                {"value": "tulipes", "label": "Tulipes", "priceModifier": 3},
                {"value": "lys", "label": "Lys", "priceModifier": 6},
                {"value": "mix", "label": "Mélange varié", "priceModifier": 4}
            ]
        },
        "ribbon": {
            "label": "Ruban décoratif",
            "required": false,
            "type": "checkbox",
            "priceModifier": 3
        },
        "message": {
            "label": "Message sur carte",
            "required": false,
            "type": "text",
            "placeholder": "Votre message (50 caractères max)",
            "priceModifier": 2
        }
    }
}
```

---

## 💍 BRACELET PERSONNALISÉ

```json
{
    "id": 1763646176450,
    "name": "Bracelet fleurs séchées",
    "category": "bijoux",
    "price": 18,
    "stock": 30,
    "image": "images/bracelet.jpg",
    "description": "Bracelet délicat avec fleurs séchées",
    "customizable": true,
    "options": {
        "size": {
            "label": "Tour de poignet",
            "required": true,
            "choices": [
                {"value": "16cm", "label": "16 cm (XS)", "priceModifier": 0},
                {"value": "18cm", "label": "18 cm (S/M)", "priceModifier": 0},
                {"value": "20cm", "label": "20 cm (L)", "priceModifier": 0},
                {"value": "custom", "label": "Sur mesure", "priceModifier": 3}
            ]
        },
        "flowers": {
            "label": "Choix des fleurs",
            "required": true,
            "type": "select",
            "choices": [
                {"value": "lavande", "label": "Lavande 🌿", "priceModifier": 0},
                {"value": "rose", "label": "Rose 🌹", "priceModifier": 2},
                {"value": "gypsophile", "label": "Gypsophile ☁️", "priceModifier": 0},
                {"value": "eucalyptus", "label": "Eucalyptus 🍃", "priceModifier": 1},
                {"value": "immortelle", "label": "Immortelle ⭐", "priceModifier": 2},
                {"value": "mix", "label": "Mélange personnalisé 🌸", "priceModifier": 3}
            ]
        },
        "material": {
            "label": "Matériau du fermoir",
            "required": true,
            "choices": [
                {"value": "argent", "label": "Argent 925", "priceModifier": 0},
                {"value": "or", "label": "Plaqué or 18k", "priceModifier": 5},
                {"value": "laiton", "label": "Laiton doré", "priceModifier": 2}
            ]
        },
        "gift_box": {
            "label": "Coffret cadeau",
            "required": false,
            "type": "checkbox",
            "priceModifier": 5
        }
    }
}
```

---

## 🎀 PEIGNE MARIÉE

```json
{
    "id": 1763646176451,
    "name": "Peigne de mariée",
    "category": "accessoires",
    "price": 45,
    "stock": 15,
    "image": "images/peigne-mariee.jpg",
    "description": "Peigne élégant pour coiffure de mariée",
    "customizable": true,
    "options": {
        "style": {
            "label": "Style",
            "required": true,
            "choices": [
                {"value": "romantique", "label": "Romantique (roses et gypsophile)", "priceModifier": 0},
                {"value": "boheme", "label": "Bohème (fleurs séchées champêtres)", "priceModifier": 5},
                {"value": "elegant", "label": "Élégant (orchidées et perles)", "priceModifier": 10},
                {"value": "vintage", "label": "Vintage (dentelle et fleurs)", "priceModifier": 8}
            ]
        },
        "color": {
            "label": "Couleur dominante",
            "required": true,
            "type": "select",
            "choices": [
                {"value": "blanc", "label": "Blanc pur", "priceModifier": 0},
                {"value": "ivoire", "label": "Ivoire", "priceModifier": 0},
                {"value": "rose-pale", "label": "Rose pâle", "priceModifier": 0},
                {"value": "champagne", "label": "Champagne", "priceModifier": 2},
                {"value": "bleu", "label": "Bleu (something blue)", "priceModifier": 3}
            ]
        },
        "pearls": {
            "label": "Ajout de perles",
            "required": false,
            "type": "checkbox",
            "priceModifier": 7
        },
        "crystals": {
            "label": "Cristaux Swarovski",
            "required": false,
            "type": "checkbox",
            "priceModifier": 12
        },
        "personalization": {
            "label": "Personnalisation spéciale",
            "required": false,
            "type": "text",
            "placeholder": "Ex: plus de verdure, moins de fleurs, etc.",
            "priceModifier": 0
        }
    }
}
```

---

## 💐 BOUQUET PERSONNALISÉ

```json
{
    "id": 1763646176452,
    "name": "Bouquet sur mesure",
    "category": "bouquets",
    "price": 50,
    "stock": 25,
    "image": "images/bouquet.jpg",
    "description": "Créez votre bouquet personnalisé",
    "customizable": true,
    "options": {
        "size": {
            "label": "Taille du bouquet",
            "required": true,
            "choices": [
                {"value": "small", "label": "Petit (15-20 tiges)", "priceModifier": 0},
                {"value": "medium", "label": "Moyen (25-30 tiges)", "priceModifier": 20},
                {"value": "large", "label": "Grand (40-50 tiges)", "priceModifier": 40},
                {"value": "xl", "label": "Extra Large (60+ tiges)", "priceModifier": 70}
            ]
        },
        "main_flower": {
            "label": "Fleur principale",
            "required": true,
            "type": "select",
            "choices": [
                {"value": "rose", "label": "Roses", "priceModifier": 0},
                {"value": "tulipe", "label": "Tulipes", "priceModifier": -5},
                {"value": "pivoine", "label": "Pivoines (saison)", "priceModifier": 15},
                {"value": "lys", "label": "Lys", "priceModifier": 5},
                {"value": "tournesol", "label": "Tournesols", "priceModifier": -3},
                {"value": "orchidee", "label": "Orchidées", "priceModifier": 20}
            ]
        },
        "color_theme": {
            "label": "Palette de couleurs",
            "required": true,
            "choices": [
                {"value": "blanc", "label": "Blanc & Vert", "priceModifier": 0},
                {"value": "rose", "label": "Rose & Bordeaux", "priceModifier": 0},
                {"value": "rouge", "label": "Rouge passion", "priceModifier": 0},
                {"value": "pastel", "label": "Pastel doux", "priceModifier": 0},
                {"value": "vif", "label": "Couleurs vives", "priceModifier": 0},
                {"value": "automne", "label": "Tons automnaux", "priceModifier": 2}
            ]
        },
        "greenery": {
            "label": "Type de verdure",
            "required": false,
            "type": "select",
            "choices": [
                {"value": "eucalyptus", "label": "Eucalyptus", "priceModifier": 3},
                {"value": "fougere", "label": "Fougères", "priceModifier": 2},
                {"value": "lierre", "label": "Lierre", "priceModifier": 2},
                {"value": "mix", "label": "Mélange", "priceModifier": 4}
            ]
        },
        "wrapping": {
            "label": "Emballage",
            "required": true,
            "choices": [
                {"value": "kraft", "label": "Papier kraft naturel", "priceModifier": 0},
                {"value": "cellophane", "label": "Cellophane transparent", "priceModifier": 2},
                {"value": "tissu", "label": "Tissu élégant", "priceModifier": 5},
                {"value": "luxe", "label": "Emballage luxe", "priceModifier": 10}
            ]
        },
        "card_message": {
            "label": "Message sur carte",
            "required": false,
            "type": "text",
            "placeholder": "Votre message personnalisé",
            "priceModifier": 3
        },
        "delivery_time": {
            "label": "Heure de livraison souhaitée",
            "required": false,
            "type": "text",
            "placeholder": "Ex: 14h-16h",
            "priceModifier": 0
        }
    }
}
```

---

## 🎁 COFFRET CADEAU

```json
{
    "id": 1763646176453,
    "name": "Coffret cadeau personnalisé",
    "category": "coffrets",
    "price": 65,
    "stock": 10,
    "image": "images/coffret.jpg",
    "description": "Créez votre coffret cadeau sur mesure",
    "customizable": true,
    "options": {
        "box_size": {
            "label": "Taille du coffret",
            "required": true,
            "choices": [
                {"value": "small", "label": "Petit (3-4 articles)", "priceModifier": 0},
                {"value": "medium", "label": "Moyen (5-7 articles)", "priceModifier": 15},
                {"value": "large", "label": "Grand (8-10 articles)", "priceModifier": 30}
            ]
        },
        "include_bracelet": {
            "label": "Inclure un bracelet",
            "required": false,
            "type": "checkbox",
            "priceModifier": 18
        },
        "include_peigne": {
            "label": "Inclure un peigne",
            "required": false,
            "type": "checkbox",
            "priceModifier": 25
        },
        "include_bouquet": {
            "label": "Inclure un mini bouquet séché",
            "required": false,
            "type": "checkbox",
            "priceModifier": 15
        },
        "include_candle": {
            "label": "Inclure une bougie parfumée",
            "required": false,
            "type": "checkbox",
            "priceModifier": 12
        },
        "include_soap": {
            "label": "Inclure savon artisanal",
            "required": false,
            "type": "checkbox",
            "priceModifier": 8
        },
        "gift_wrap": {
            "label": "Emballage cadeau premium",
            "required": false,
            "type": "checkbox",
            "priceModifier": 10
        },
        "card_text": {
            "label": "Message sur la carte",
            "required": false,
            "type": "text",
            "placeholder": "Votre message personnalisé",
            "priceModifier": 0
        },
        "occasion": {
            "label": "Occasion",
            "required": false,
            "type": "select",
            "choices": [
                {"value": "anniversaire", "label": "Anniversaire", "priceModifier": 0},
                {"value": "mariage", "label": "Mariage", "priceModifier": 0},
                {"value": "naissance", "label": "Naissance", "priceModifier": 0},
                {"value": "merci", "label": "Remerciement", "priceModifier": 0},
                {"value": "amour", "label": "Déclaration d'amour", "priceModifier": 0},
                {"value": "autre", "label": "Autre", "priceModifier": 0}
            ]
        }
    }
}
```

---

## 💐 BOUCLES D'OREILLES

```json
{
    "id": 1763646176454,
    "name": "Boucles d'oreilles fleurs",
    "category": "bijoux",
    "price": 22,
    "stock": 40,
    "image": "images/boucles-oreilles.jpg",
    "description": "Délicates boucles d'oreilles avec fleurs séchées",
    "customizable": true,
    "options": {
        "style": {
            "label": "Style",
            "required": true,
            "choices": [
                {"value": "puces", "label": "Puces (discrètes)", "priceModifier": 0},
                {"value": "pendantes", "label": "Pendantes courtes", "priceModifier": 3},
                {"value": "longues", "label": "Pendantes longues", "priceModifier": 5},
                {"value": "creoles", "label": "Créoles", "priceModifier": 4}
            ]
        },
        "metal": {
            "label": "Métal",
            "required": true,
            "choices": [
                {"value": "argent", "label": "Argent 925", "priceModifier": 0},
                {"value": "or", "label": "Plaqué or 18k", "priceModifier": 8},
                {"value": "laiton", "label": "Laiton doré", "priceModifier": 3}
            ]
        },
        "flower_type": {
            "label": "Type de fleur",
            "required": true,
            "type": "select",
            "choices": [
                {"value": "gypsophile", "label": "Gypsophile", "priceModifier": 0},
                {"value": "lavande", "label": "Lavande", "priceModifier": 1},
                {"value": "rose", "label": "Rose miniature", "priceModifier": 2},
                {"value": "hortensia", "label": "Hortensia", "priceModifier": 2},
                {"value": "immortelle", "label": "Immortelle", "priceModifier": 2}
            ]
        },
        "resin_color": {
            "label": "Couleur de la résine",
            "required": false,
            "type": "select",
            "choices": [
                {"value": "transparent", "label": "Transparent", "priceModifier": 0},
                {"value": "rose", "label": "Rose pâle", "priceModifier": 0},
                {"value": "bleu", "label": "Bleu ciel", "priceModifier": 0},
                {"value": "violet", "label": "Violet", "priceModifier": 0},
                {"value": "nacre", "label": "Effet nacré", "priceModifier": 3}
            ]
        },
        "hypoallergenic": {
            "label": "Version hypoallergénique",
            "required": false,
            "type": "checkbox",
            "priceModifier": 5
        }
    }
}
```

---

## 📝 NOTES D'UTILISATION

### Comment ajouter ces produits ?

1. Ouvrir `products.json`
2. Copier l'exemple souhaité
3. Coller dans le tableau `"products": [...]`
4. **Changer l'ID** pour qu'il soit unique
5. Modifier les images, prix, stock selon vos besoins
6. Sauvegarder

### Changer un ID

```json
"id": 1763646176449  // ← Remplacer par un timestamp unique
```

Pour générer un nouveau timestamp :
```javascript
console.log(Date.now()) // Exécuter dans la console du navigateur
```

### Modifier les prix

```json
"price": 35,  // Prix de base
"priceModifier": 15  // Supplément pour cette option
```

### Rendre une option obligatoire

```json
"required": true  // Client doit choisir
"required": false // Optionnel
```

---

## 🎨 PERSONNALISATION DES ICÔNES

Dans `script.js`, ligne ~710, vous pouvez modifier les icônes :

```javascript
let icon = '✨';
if (key === 'size') icon = '📏';
else if (key === 'text') icon = '💬';
else if (key === 'flowers') icon = '🌸';
else if (key === 'color') icon = '🎨';
else if (key === 'material') icon = '💎';
// Ajouter vos icônes personnalisées ici
```

---

## 💡 CONSEILS

1. **Testez toujours** après avoir ajouté un produit
2. **Vérifiez les calculs** de prix
3. **Utilisez des images** de qualité
4. **Descriptions claires** pour chaque option
5. **Prix cohérents** avec votre positionnement

---

## 🆘 AIDE

Si une option ne s'affiche pas :
1. Vérifier la syntaxe JSON
2. Vérifier que `customizable: true` est présent
3. Vider le cache du navigateur (Ctrl+F5)
4. Vérifier la console (F12)

---

**Bon courage ! 🌸**
