# 10 — Les portails React

Cet exercice montre comment afficher une modale en dehors du conteneur DOM de son composant parent avec `createPortal`.

## Le problème de départ

Dans `src/App.jsx`, le composant `App` affiche trois paragraphes et un composant `Modal` dans un conteneur avec les styles suivants :

```jsx
height: 300,
overflowY: 'scroll',
background: '#EEE',
margin: 20,
position: 'relative'
```

Sans portail, la modale serait un élément DOM de ce conteneur. Avec `position: 'absolute'`, `top: 0` et `right: 0`, elle serait positionnée par rapport à ce parent en `position: 'relative'` et soumise à son contexte de défilement.

## Utiliser createPortal

On importe `createPortal` depuis `react-dom` :

```jsx
import {createPortal} from "react-dom";
```

La fonction reçoit le contenu à afficher et le nœud DOM dans lequel le placer :

```jsx
createPortal(contenu, conteneurDOM)
```

Dans cet exercice, `Modal` utilise `document.body` comme destination :

```jsx
function Modal() {
    return createPortal(<div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 10,
        border: 'solid 1px grey',
        background: '#FFF'
    }}>
        Je suis une modale
    </div>, document.body);
}
```

L'appel reste à sa place dans le JSX de `App` :

```jsx
<Modal />
```

Mais le `<div>` produit par `Modal` est ajouté dans `document.body`, en dehors du conteneur gris. Il échappe donc au défilement et au positionnement relatif de ce conteneur.

## Arbre React et arbre DOM

Le portail change l'emplacement dans le DOM, mais `Modal` reste un enfant de `App` dans l'arbre React. Les props, le contexte et la propagation des événements React continuent de suivre cet arbre React.

Pour observer la différence, ouvrir les outils de développement du navigateur et repérer le texte « Je suis une modale » : son élément se trouve directement sous `<body>`, à côté du conteneur racine de l'application.

## À retenir

- Un portail permet de choisir un autre emplacement DOM pour un contenu React.
- Le nœud DOM de destination doit déjà exister.
- Un portail est utile pour les modales, les infobulles et les menus qui doivent sortir d'un conteneur.
- Il ne fournit pas automatiquement un fond assombri, la gestion du focus ou la fermeture au clavier.
- Ici, la modale utilise `position: 'absolute'`. Pour la maintenir dans un coin de la fenêtre pendant le défilement de la page, on pourrait utiliser `position: 'fixed'`.

## Lancer le projet

Depuis le dossier `10- portails` :

```bash
npm install
npm run dev
```

Pour générer la version de production :

```bash
npm run build
```
