# SOSParking

SOSParking est une application mobile React Native (Expo) qui aide l’utilisateur à trouver des places de stationnement proches sur une carte, avec géolocalisation en temps réel, code couleur par distance, et notifications de proximité.

---

## Fonctionnalités

- **Localisation utilisateur en temps réel** (Expo Location)
- **Affichage carte** avec `react-native-maps`
- **Markers de stationnement** depuis les données ouvertes de Montréal
- **Code couleur des markers**
    - Rouge = à portée
    - Jaune = hors portée
-  **Notifications locales** quand un stationnement est à proximité
-  **Mode DEV**
    - Activation/désactivation via switch
    - Déplacement manuel de la position utilisateur (↑ ↓ ← →)
    - Slider pour contrôler la distance de déplacement

---

## Stack technique

- **React Native**
- **Expo**
- **react-native-maps**
- **expo-location**
- **expo-notifications**
- **@react-native-community/slider**
- **React Navigation**

---

##  Installation

```bash
git clone <url-du-repo>
cd SOSParking
npm install
```

Si tu utilises Expo :

```bash
npx expo start
```

---

## Lancer le projet

```bash
npx expo start
```

Puis ouvre l’application avec :

- Expo Go (mobile)
- Simulateur iOS
- Émulateur Android

---

## Permissions requises

L’application demande :

- **Permission de localisation** (foreground)
- **Permission de notifications**

Sans ces permissions, certaines fonctionnalités ne fonctionneront pas.

---

## Fonctionnement principal

1. L’app récupère les données de stationnement via l’API de données ouvertes de Montréal.
2. Elle récupère la position utilisateur.
3. Elle calcule la distance entre l’utilisateur et chaque stationnement (`GetDistanceInKm`).
4. Elle met à jour :
    - la couleur des markers
    - l’envoi d’une notification si un parking est dans le seuil configuré.

---

## Mode DEV

Le mode DEV permet de tester la logique “proximité + notifications” sans se déplacer physiquement.

### Comportement

- **Mode DEV ON** : la position GPS réelle est figée, les flèches déplacent la position simulée.
- **Mode DEV OFF** : retour immédiat à la position GPS réelle.

### Contrôles

- Switch `Mode DEV`
- Boutons directionnels ↑ ↓ ← →
- Slider de distance de pas (step)

---

## Notifications de proximité

Le composant `NotificationCmp` :

- surveille la position utilisateur
- calcule la distance aux parkings
- envoie une notification locale quand `distance <= thresHoldKm`
- évite les doublons grâce à un `Set` (`notificationParkings`)

---

## Structure (exemple)

```txt
SOSParking/
├── components/
│   ├── Map.js
│   └── NotificationCmp.js
├── Utils/
│   └── Utils.js
├── screens/
│   └── DetailScreen.js
├── App.js
└── README.md
```

---

## Paramètres utiles

Dans `Map.js` :

- `closeDistance` : seuil (km) pour marker “à portée”
- `devStep` : pas de déplacement en mode DEV (degrés lat/lon)

Dans `NotificationCmp.js` :

- `thresHoldKm` : seuil (km) pour déclencher une notification

👉 Recommandation : utiliser **la même valeur** pour `closeDistance` et `thresHoldKm` pour un comportement cohérent.

---

## Dépannage rapide

### Pas de notification en mode DEV
- Vérifier permission notifications (`granted`)
- Vérifier que `thresHoldKm` n’est pas trop petit
- Réduire `devStep` (sinon tu “sautes” la zone de proximité)
- Tester sur appareil réel (surtout iOS)

### Les couleurs des markers ne changent pas
- Vérifier que `userLocation` se met bien à jour
- Vérifier la cohérence de `closeDistance`
- Ajouter des logs sur la distance calculée

---