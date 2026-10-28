# Tuto React

Ce README regroupe les notions abordées au fil de mes révisions de React, avec des exemples de code et des explications pour servir d'aide-mémoire.

## 1. useState — Gestion des états

### Déclarer un state

Le hook `useState` permet de **stocker une valeur dans un composant et de déclencher un nouveau rendu lorsqu'elle change**.

```jsx
const [person, setPerson] = React.useState({
  firstname: 'John',
  lastname: 'Doe',
  age: 18
});
```

- `person` : contient la valeur actuelle du state.
- `setPerson` : fonction permettant de modifier le state.
- `React.useState(...)` : initialise le state avec une valeur par défaut.

### Modifier un state contenant un objet

```jsx
const increment = () => {
  setPerson({ ...person, age: person.age + 1 });
};
```

- `setPerson()` : demande une mise à jour du state.
- `...person` : copie les propriétés de l'objet existant dans un nouvel objet.
- `age: person.age + 1` : remplace la propriété `age` par sa nouvelle valeur.

**Important :** ne jamais modifier directement un state. Il faut utiliser son setter pour que React prenne en compte la modification.

### Utiliser le state dans le JSX

```jsx
<p>Age de {person.firstname} : {person.age}</p>
<button onClick={increment}>Gagner une année</button>
```

- `{person.firstname}` et `{person.age}` : affichent les valeurs du state.
- `onClick={increment}` : appelle la fonction lors du clic.
- La modification du state entraîne un nouveau rendu du composant.

### Bonne pratique : mise à jour fonctionnelle

Lorsque la nouvelle valeur dépend de la précédente, privilégier :

```jsx
setPerson(prev => ({
  ...prev,
  age: prev.age + 1
}));
```

Cette syntaxe permet d'utiliser la dernière valeur disponible du state, même lorsque React regroupe plusieurs mises à jour.

**À retenir :** `useState` permet de gérer les données qui évoluent dans un composant. Toute modification doit passer par son setter.

## 2. Les formulaires — Champs contrôlés et non contrôlés

En React, il existe deux façons principales de gérer les valeurs des champs d'un formulaire :

- **Champs contrôlés** : React gère les valeurs des champs via un `useState`.
- **Champs non contrôlés** : le navigateur conserve les valeurs des champs, récupérées au moment de la soumission avec `FormData`.

### Méthode 1 : Champ contrôlé avec useState

```jsx
const [firstName, setFirstName] = React.useState("John Doe");

const handleChange = (e) => {
  setFirstName(e.target.value);
};

const reset = () => {
  setFirstName('');
};

return <form>
  <input
    type="text"
    name="firstname"
    value={firstName}
    onChange={handleChange}
  />
  {firstName}
  <button onClick={reset} type="button">Reset</button>
</form>;
```

**Fonctionnement :**

- `useState` : stocke la valeur actuelle du champ.
- `value={firstName}` : lie la valeur du champ au state React.
- `onChange={handleChange}` : met à jour le state à chaque modification.
- `e.target.value` : récupère la nouvelle valeur saisie.
- `setFirstName('')` : vide le champ en modifiant son state.

**Quand utiliser un champ contrôlé ?**

Lorsque React doit connaître ou modifier la valeur du champ **pendant que l'utilisateur interagit avec le formulaire**.

Exemples :
- Effectuer une validation en temps réel (email, mot de passe, etc.).
- Afficher dynamiquement un message selon la saisie.
- Activer ou désactiver un bouton selon les valeurs.
- Mettre à jour d'autres composants selon la saisie.
- Modifier ou réinitialiser les valeurs depuis React.

### Méthode 2 : Champ non contrôlé avec FormData

```jsx
const handleSubmit = (ev) => {
  ev.preventDefault();
  console.log(new FormData(ev.currentTarget));
};

return <form onSubmit={handleSubmit}>
  <input
    type="text"
    name="firstName"
    defaultValue="John Doe"
  />
  <button type="submit">Submit</button>
</form>;
```

**Fonctionnement :**

- `defaultValue` : définit la valeur initiale du champ sans le contrôler avec React.
- `onSubmit={handleSubmit}` : déclenche la fonction lors de la soumission.
- `ev.preventDefault()` : empêche le rechargement de la page lié à la soumission native.
- `new FormData(ev.currentTarget)` : récupère les données des champs du formulaire possédant un attribut `name`.
- `ev.currentTarget` : désigne ici le formulaire auquel l'événement est attaché.

Pour afficher les valeurs dans la console :

```jsx
const data = new FormData(ev.currentTarget);
console.log(Object.fromEntries(data.entries()));
```

**Quand utiliser un champ non contrôlé ?**

Lorsque les valeurs des champs sont uniquement nécessaires **au moment de la soumission du formulaire**.

Exemples :
- Formulaire de contact simple.
- Barre de recherche dont la valeur est utilisée uniquement après validation.
- Formulaire contenant plusieurs champs indépendants.
- Formulaire sans validation dynamique ni interaction particulière.

### Comparaison des deux méthodes

| Critère | Contrôlé | Non contrôlé |
|---|---|---|
| Gestion des valeurs | React (`useState`) | Navigateur |
| Lecture des valeurs | À chaque modification | À la soumission |
| Validation en temps réel | Facile | Nécessite une gestion supplémentaire |
| Modification depuis React | Facile | Moins directe |
| Quantité de code | Plus importante | Plus réduite |
| Soumission avec FormData | Possible | Oui |

### Bonne pratique : choisir selon le besoin

**Privilégier un champ non contrôlé** pour les formulaires simples dont les valeurs ne sont utilisées qu'à la soumission. Cela évite de multiplier inutilement les `useState`.

**Privilégier un champ contrôlé** lorsqu'il faut réagir dynamiquement aux modifications des champs.

Les deux méthodes peuvent être utilisées avec un `handleSubmit` : un champ contrôlé n'empêche pas de récupérer les données via `FormData`.

**À retenir :** un formulaire n'a pas systématiquement besoin de `useState`. Le choix dépend principalement de la nécessité ou non de suivre et manipuler les valeurs pendant la saisie.

## 3. Le flux de données — Communication entre composants

En React, les données circulent principalement **du composant parent vers le composant enfant**, grâce aux `props`.

Lorsqu'un composant enfant doit modifier une donnée appartenant au parent, celui-ci peut lui transmettre une fonction permettant de mettre à jour son state.

C'est le principe du **flux de données unidirectionnel**.

### 1. Déclarer le state dans le composant parent

```jsx
function App() {
  const [isTermAccepted, setIsTermAccepted] = React.useState(false);

  return <form>
    <CGUCheckbox
      checked={isTermAccepted}
      onCheck={setIsTermAccepted}
    />
    <button disabled={!isTermAccepted}>
      Envoyer le formulaire
    </button>
  </form>;
}
```

**Fonctionnement :**

- `isTermAccepted` : contient l'état actuel de la case à cocher (`true` ou `false`).
- `setIsTermAccepted` : fonction permettant de modifier cet état.
- `checked={isTermAccepted}` : transmet la valeur du state au composant enfant.
- `onCheck={setIsTermAccepted}` : transmet la fonction de modification au composant enfant.
- `disabled={!isTermAccepted}` : désactive le bouton tant que les CGU ne sont pas acceptées.

Le composant `App` reste **responsable de la gestion du state**.

### 2. Récupérer et utiliser les props dans le composant enfant

```jsx
function CGUCheckbox({ checked, onCheck }) {
  return <div>
    <label>
      <input
        type="checkbox"
        onChange={(e) => onCheck(e.target.checked)}
        checked={checked}
      />
      Accepter les conditions d'utilisation
    </label>
  </div>;
}
```

**Fonctionnement :**

- `{ checked, onCheck }` : récupère les propriétés transmises par le parent grâce à la déstructuration.
- `checked={checked}` : utilise la valeur reçue pour contrôler la case à cocher.
- `onChange` : détecte lorsque l'utilisateur coche ou décoche la case.
- `e.target.checked` : récupère la nouvelle valeur booléenne de la case.
- `onCheck(e.target.checked)` : appelle la fonction transmise par le parent avec cette nouvelle valeur.

**Important :** le composant enfant ne modifie pas directement le state du parent. Il appelle une fonction fournie par ce dernier.

### 3. Comprendre le flux de données

Le fonctionnement suit les étapes suivantes :

1. `App` initialise `isTermAccepted` à `false`.
2. `App` transmet sa valeur à `CGUCheckbox` via la prop `checked`.
3. L'utilisateur coche la case.
4. `CGUCheckbox` appelle `onCheck(true)`.
5. Cette fonction correspond à `setIsTermAccepted(true)` dans le parent.
6. React effectue un nouveau rendu avec le state actualisé.
7. La case est cochée et le bouton devient actif.

**Schéma simplifié :**

```text
App (Parent)
│
├── State : isTermAccepted
│
├── checked={isTermAccepted} ─────┐
│                                ▼
│                          CGUCheckbox
│                                │
│                          onChange
│                                │
│                          onCheck(true)
│                                │
├── setIsTermAccepted(true) ◄─────┘
│
└── Mise à jour du bouton
    disabled={!isTermAccepted}
```

### 4. Quand utiliser ce fonctionnement ?

Cette approche est particulièrement utile lorsque **plusieurs composants doivent utiliser une même donnée**.

Exemples :
- Une checkbox qui active ou désactive un bouton.
- Un champ de recherche qui filtre une liste affichée dans un autre composant.
- Un formulaire composé de plusieurs sous-composants.
- Un panier dont le total est actualisé lors de la modification des quantités.

On appelle **lifting state up** (remontée du state) le fait de placer un état dans un composant parent commun afin que plusieurs composants puissent le partager.

### 5. Bonnes pratiques

- **Props** : utilisées pour transmettre des données et des fonctions du parent vers l'enfant.
- **State** : placé dans le composant qui en a besoin, ou dans leur plus proche parent commun s'il doit être partagé.
- **Callback** : fonction transmise à l'enfant pour lui permettre de demander une modification.
- **Immutabilité des props** : un composant enfant ne doit pas modifier directement les props qu'il reçoit.

**À retenir :** les données descendent du parent vers l'enfant via les `props`. Pour demander une modification, l'enfant peut appeler une fonction transmise par le parent. Le parent met à jour son state, ce qui entraîne un nouveau rendu des composants concernés.

## 4. Liste de produits — Recherche, filtrage et composition de composants

Cet exercice combine les notions précédentes pour afficher **un tableau de produits classés par catégorie**, avec une recherche par nom et une option pour n'afficher que les produits en stock.

### 1. Décrire les produits et découper l'interface

Chaque produit est représenté par un objet :

```jsx
{ category: "Fruits", price: "$1", stocked: true, name: "Apple" }
```

- `category` : catégorie du produit.
- `price` : prix affiché.
- `stocked` : indique si le produit est en stock.
- `name` : nom utilisé pour l'affichage et la recherche.

L'interface est répartie entre plusieurs composants :

```text
App
├── SearchBar
│   ├── Input
│   └── Checkbox
└── ProductTable
    ├── ProductCategoryRow
    └── ProductRow
```

- `App` : conserve les filtres et calcule les produits visibles.
- `SearchBar` : rassemble les contrôles de recherche et de stock.
- `Input` et `Checkbox` : composants de formulaire réutilisables.
- `ProductTable` : construit les lignes du tableau.
- `ProductCategoryRow` et `ProductRow` : affichent une catégorie et un produit.

### 2. Placer les états dans le parent commun

```jsx
const [showStockedOnly, setShowStockedOnly] = useState(false);
const [search, setSearch] = useState('');

return <div className="container my-3">
  <SearchBar
    search={search}
    onSearchChange={setSearch}
    showStockedOnly={showStockedOnly}
    onStockedOnlyChange={setShowStockedOnly}
  />
  <ProductTable products={visibleProducts} />
</div>;
```

**Fonctionnement :**

- `search` : contient le texte recherché, initialement vide.
- `showStockedOnly` : indique si le filtre de stock est actif, initialement à `false`.
- Les valeurs et leurs setters sont transmis à `SearchBar` via les `props`.
- `ProductTable` reçoit uniquement la liste des produits à afficher.

Le state est placé dans `App`, car les contrôles de recherche et le tableau dépendent des mêmes filtres. C'est une application du **lifting state up**.

### 3. Utiliser des champs contrôlés réutilisables

Dans `SearchBar`, le champ de recherche reçoit la valeur et la fonction de modification du parent :

```jsx
<Input
  value={search}
  onChange={onSearchChange}
  placeholder="Rechercher..."
/>
```

Le composant `Input` transmet directement le texte saisi à sa fonction `onChange` :

```jsx
<input
  type="text"
  className="form-control"
  value={value}
  onChange={(e) => onChange(e.target.value)}
  placeholder={placeholder}
/>
```

Le composant `Checkbox` suit le même principe avec une valeur booléenne :

```jsx
<input
  id={id}
  type="checkbox"
  className="form-check-input"
  checked={checked}
  onChange={(e) => onChange(e.target.checked)}
/>
<label className="form-check-label" htmlFor={id}>{label}</label>
```

- `e.target.value` : récupère le texte du champ.
- `e.target.checked` : récupère l'état de la case à cocher.
- `htmlFor={id}` : associe le label à la case correspondante.
- Ces composants transmettent une valeur simple au parent, sans lui imposer de manipuler l'événement du navigateur.

### 4. Calculer les produits visibles avec filter

```jsx
const visibleProducts = PRODUCTS.filter(product => {
  if (showStockedOnly && !product.stocked) {
    return false;
  }

  if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
    return false;
  }

  return true;
});
```

**Fonctionnement :**

- `filter()` : crée un nouveau tableau contenant les produits conservés, sans modifier `PRODUCTS`.
- Le premier test exclut les produits indisponibles lorsque le filtre de stock est coché.
- Le second exclut les produits dont le nom ne contient pas la recherche.
- `toLowerCase()` : rend la comparaison insensible à la casse.
- `includes()` : recherche une partie du nom, sans exiger une correspondance exacte.
- `return true` : conserve le produit lorsqu'il satisfait les deux filtres.

**Exemple :** une recherche sur `p` conserve les produits dont le nom contient cette lettre. Si le filtre de stock est aussi actif, seuls ceux qui sont disponibles restent affichés.

**Bonne pratique :** `visibleProducts` est une **donnée dérivée**, recalculée à chaque rendu à partir de `PRODUCTS` et des filtres. Il n'est pas nécessaire de la stocker dans un autre `useState`.

### 5. Construire les lignes et afficher les catégories

```jsx
const rows = [];
let lastCategory = null;

for (let product of products) {
  if (product.category !== lastCategory) {
    rows.push(
      <ProductCategoryRow key={product.category} name={product.category} />
    );
  }
  lastCategory = product.category;
  rows.push(<ProductRow product={product} key={product.name} />);
}
```

**Fonctionnement :**

- `rows` : rassemble les éléments JSX à afficher dans le `<tbody>` du tableau.
- `lastCategory` : mémorise la catégorie du produit précédent.
- Lorsqu'une nouvelle catégorie est rencontrée, une ligne de titre est ajoutée avant le produit.
- `key` : permet à React d'identifier les éléments d'une liste entre les rendus. Les catégories et les noms sont uniques dans les données de cet exercice.

**Important :** ce fonctionnement suppose que les produits d'une même catégorie se suivent dans le tableau de données. La boucle ne trie pas les produits ; `filter()` conserve leur ordre initial.

La ligne de catégorie utilise une cellule qui occupe les deux colonnes :

```jsx
<tr>
  <td colSpan={2}><strong>{name}</strong></td>
</tr>
```

### 6. Adapter l'affichage selon le stock

Dans `ProductRow`, le nom des produits indisponibles apparaît en rouge :

```jsx
const style = product.stocked ? undefined : { color: 'red' };

return <tr>
  <td style={style}>{product.name}</td>
  <td>{product.price}</td>
</tr>;
```

- L'opérateur ternaire choisit le style selon la valeur de `product.stocked`.
- `undefined` : aucun style en ligne n'est ajouté pour un produit disponible.
- `{ color: 'red' }` : définit le style du nom d'un produit indisponible.
- En JSX, la prop `style` reçoit un objet JavaScript.

**À retenir :** `App` centralise les filtres, les champs contrôlés demandent leur modification via des callbacks, et la liste visible est recalculée à chaque rendu. La composition de composants permet ensuite d'afficher les produits, leurs catégories et leur disponibilité avec des responsabilités bien définies.

## 5. useEffect — Synchroniser un composant avec l'extérieur

Le hook `useEffect` permet de **synchroniser un composant avec un système extérieur à React** : le titre de la page, un événement du navigateur ou un timer, par exemple.

Il s'importe depuis React :

```jsx
import { useEffect } from 'react';
```

### 1. Comprendre la structure d'un effet

```jsx
useEffect(() => {
  // Installer ou mettre à jour la synchronisation.

  return () => {
    // Nettoyer la synchronisation précédente si nécessaire.
  };
}, [dependance]);
```

- La fonction de l'effet s'exécute après que React a appliqué le rendu.
- Le tableau de dépendances indique quelles valeurs doivent provoquer une nouvelle synchronisation.
- La fonction retournée est le **nettoyage** (ou *cleanup*). Elle est facultative si l'effet n'a rien à annuler ou à restaurer.
- Avant de relancer un effet dont les dépendances ont changé, React exécute son ancien nettoyage.
- Le nettoyage s'exécute aussi lorsque le composant est retiré de l'interface.

| Écriture | Quand l'effet s'exécute-t-il ? |
|---|---|
| `useEffect(fn)` | Après chaque rendu appliqué du composant |
| `useEffect(fn, [])` | Au montage, sans relance liée aux changements de state ou de props |
| `useEffect(fn, [title])` | Au montage, puis lorsque `title` change |

**Important :** en développement avec `StrictMode`, React peut effectuer un cycle supplémentaire installation → nettoyage → installation pour vérifier les effets. Un effet correctement nettoyé doit supporter ce fonctionnement.

### 2. Afficher ou masquer un composant

La première partie de l'exercice est actuellement commentée dans `App`. Elle permet de monter et démonter `EditTitle` avec une checkbox :

```jsx
const [showInput, setShowInput] = React.useState(false);

return <div>
  <Checkbox
    label="Afficher"
    checked={showInput}
    onChange={setShowInput}
  />
  {showInput && <EditTitle />}
</div>;
```

**Fonctionnement :**

1. `showInput` vaut `false` : `EditTitle` n'est pas affiché.
2. L'utilisateur coche la case : `setShowInput(true)` est appelé.
3. React ajoute `EditTitle` à l'interface : c'est son **montage**, et ses effets sont installés.
4. L'utilisateur décoche la case : React retire `EditTitle`, c'est son **démontage**.
5. React appelle les fonctions de nettoyage de ses effets.

**À retenir :** l'affichage conditionnel utilise le state et le JSX, sans avoir besoin d'un effet. Quand `EditTitle` est remonté, ses états locaux sont réinitialisés.

### 3. Modifier le titre de la page

Dans `EditTitle`, le champ est lié au state `title` :

```jsx
const [title, setTitle] = React.useState('');

useEffect(() => {
  document.title = title;
}, [title]);

// Dans le JSX :
<Input
  placeholder="Modifier le titre"
  value={title}
  onChange={setTitle}
/>
```

**Fonctionnement :**

1. L'utilisateur écrit dans le champ.
2. `Input` transmet le texte à `setTitle`.
3. React effectue un nouveau rendu avec le nouveau `title`.
4. L'effet dépendant de `[title]` met à jour le titre de l'onglet du navigateur.

Le champ « Prénom » possède un state indépendant, `firstname`. Le modifier provoque un rendu, mais ne relance pas cet effet puisque `title` n'a pas changé.

**Important :** l'effet s'exécute aussi au montage. Comme `title` est initialement vide, le titre de la page devient d'abord vide.

### 4. Restaurer le titre au démontage

Un autre effet conserve le titre présent avant l'édition :

```jsx
useEffect(() => {
  const originalTitle = document.title;

  return () => {
    document.title = originalTitle;
  };
}, []);
```

- Au montage, `originalTitle` mémorise le titre d'origine.
- Le tableau `[]` évite de reprendre un nouveau titre à chaque saisie.
- Au démontage, le nettoyage restaure la valeur mémorisée.

Dans le code, cet effet est déclaré avant celui qui modifie le titre : il peut ainsi conserver le titre initial avant son remplacement.

### 5. Écouter le défilement et retirer l'écouteur

```jsx
const [y, setY] = React.useState(0);

useEffect(() => {
  const handler = () => {
    setY(window.scrollY);
  };

  window.addEventListener('scroll', handler);

  return () => {
    window.removeEventListener('scroll', handler);
  };
}, []);
```

**Fonctionnement :**

- `addEventListener` installe une fonction appelée lorsque la page défile.
- `window.scrollY` donne la position verticale du défilement.
- `setY` mémorise cette position pour l'afficher avec `{y}` dans le JSX.
- `removeEventListener` retire l'écouteur lorsque le composant disparaît.
- Il faut fournir **la même fonction `handler`** à l'ajout et au retrait.

Le bloc commenté de hauteur `300vh` permet d'obtenir une page assez longue pour tester le défilement.

### 6. Créer un décompteur : séparer la durée et le temps restant

La deuxième partie de l'exercice utilise deux états :

```jsx
const [duration, setDuration] = React.useState(5);
const [secondsLeft, setSecondsLeft] = React.useState(duration);

const handleChange = (value) => {
  setDuration(value);
  setSecondsLeft(value);
};
```

- `duration` : valeur saisie dans le champ, qui reste affichée pendant le décompte.
- `secondsLeft` : temps restant, qui diminue chaque seconde.
- `handleChange` : change la durée et réinitialise le décompte à la nouvelle valeur.
- `useState(duration)` définit seulement la valeur initiale de `secondsLeft`. Les modifications futures de `duration` ne sont pas automatiquement recopiées dans cet état.

```jsx
<Input
  placeholder="Timer..."
  value={duration}
  onChange={handleChange}
/>
<p>Décompte : {secondsLeft}</p>
```

### 7. Installer le timer et comprendre ses dépendances

Le principe du timer est de programmer une action toutes les secondes :

```jsx
const timer = setInterval(() => {
  setSecondsLeft(value => Math.max(0, value - 1));
}, 1000);
```

- `1000` millisecondes correspondent à une seconde.
- `setInterval` retourne l'identifiant nécessaire pour l'arrêter avec `clearInterval(timer)`.
- La mise à jour fonctionnelle `value => ...` reçoit la dernière valeur disponible de l'état.
- `Math.max(0, value - 1)` empêche un résultat négatif, mais ne suffit pas à arrêter l'intervalle.

Dans l'exercice, l'effet dépend de `[duration]` : il installe un intervalle au montage et le remplace lorsque la durée change. Le nettoyage est :

```jsx
return () => clearInterval(timer);
```

Une diminution de `secondsLeft` ne relance pas cet effet puisque `secondsLeft` ne figure pas dans ses dépendances. La mise à jour fonctionnelle permet de le modifier sans lire sa valeur depuis le rendu qui a installé l'intervalle.

**Exemple :** le décompte commence à `5`, puis affiche `4`, `3`… Si l'utilisateur saisit `10`, le handler réinitialise le temps restant à `10`, et l'effet annule l'ancien intervalle avant d'en installer un nouveau.

**Point à améliorer dans le code actuel :** `clearInterval(timer)` est appelé à l'intérieur de la fonction passée à `setSecondsLeft`. Cette fonction de mise à jour doit rester **pure** : calculer et retourner le nouvel état, sans arrêter un timer ni modifier autre chose. React peut l'appeler plusieurs fois en développement pour vérifier sa pureté.

Voici une variante pédagogique qui arrête l'intervalle en dehors du setter et valide la durée :

```jsx
useEffect(() => {
  let remaining = Number(duration);

  if (!Number.isInteger(remaining) || remaining <= 0) {
    return;
  }

  const timer = setInterval(() => {
    remaining -= 1;
    setSecondsLeft(remaining);

    if (remaining === 0) {
      clearInterval(timer);
    }
  }, 1000);

  return () => clearInterval(timer);
}, [duration]);
```

Pour cette variante, le handler peut convertir la saisie, qui arrive sous forme de texte, avant de modifier les états :

```jsx
const handleChange = (value) => {
  const seconds = Number(value);

  if (!Number.isInteger(seconds) || seconds < 0) {
    return;
  }

  setDuration(seconds);
  setSecondsLeft(seconds);
};
```

La variable `remaining` est locale à chaque installation de l'effet. Le state `secondsLeft` sert à afficher sa progression. Un vrai timer de navigateur peut subir des retards, notamment lorsque l'onglet est en arrière-plan : cet exercice illustre le fonctionnement des effets, sans garantir une mesure exacte du temps écoulé.

### 8. Ce qu'il faut éviter avec useEffect

**Recopier un state dans un autre à l'aide d'un effet.**

```jsx
// À éviter ici : cette mise à jour découle de la saisie utilisateur.
useEffect(() => {
  setSecondsLeft(duration);
}, [duration]);
```

Dans cet exercice, le handler connaît déjà les deux mises à jour à effectuer : il peut appeler `setDuration` et `setSecondsLeft` directement. Ajouter un effet pour cette copie impose un rendu supplémentaire inutile.

**Nuance importante : un setter n'est pas interdit dans un effet.** Mettre à jour un état depuis le callback d'un timer ou d'un événement `scroll` est utile pour synchroniser React avec ces événements extérieurs. Ce qu'on évite, c'est un effet servant uniquement à recalculer ou recopier des données déjà disponibles dans React.

**Créer une boucle de mises à jour.**

```jsx
// À éviter : l'effet modifie immédiatement sa propre dépendance.
useEffect(() => {
  setSecondsLeft(secondsLeft - 1);
}, [secondsLeft]);
```

Chaque modification relance l'effet, qui modifie encore l'état : le décompte tourne en boucle sans attendre une seconde. Il faut une condition d'arrêt et une vraie programmation dans le temps.

**Oublier le nettoyage ou l'exécuter immédiatement.**

```jsx
// Incorrect : arrête le timer pendant l'installation de l'effet.
return clearInterval(timer);

// Correct : fournit une fonction que React appellera au nettoyage.
return () => clearInterval(timer);
```

Sans nettoyage, les timers ou écouteurs peuvent s'accumuler lors des réinstallations et continuer à fonctionner après le démontage.

**Masquer des dépendances pour empêcher un effet de se relancer.** Toutes les valeurs réactives lues par l'effet doivent être prises en compte dans ses dépendances. Les setters fournis par `useState` ont une identité stable et peuvent être omis. Utiliser une mise à jour fonctionnelle permet de lire l'état précédent sans capturer une ancienne valeur.

**Modifier directement le DOM pour afficher un state.** Préférer `<p>{secondsLeft}</p>` à `document.getElementById(...).textContent = ...`. React actualise déjà l'affichage. En revanche, `document.title` est une synchronisation extérieure adaptée à un effet.

**Utiliser un effet pour un simple calcul.** Un filtrage comme `PRODUCTS.filter(...)` se calcule pendant le rendu. Il ne nécessite ni effet ni état supplémentaire.

**À retenir :** utiliser un effet pour installer ou mettre à jour une synchronisation extérieure, déclarer ses dépendances et nettoyer ce qui a été installé. Garder les actions liées à la saisie dans les handlers, les calculs dans le rendu, et les fonctions de mise à jour du state pures.

## 7. useRef — Conserver une valeur sans déclencher de rendu

Le hook `useRef` permet de **conserver une valeur entre les rendus sans déclencher de nouveau rendu lorsqu'on la modifie**.

Dans cet exercice, un intervalle affiche chaque seconde dans la console le texte actuellement saisi dans un champ, sans devoir recréer l'intervalle à chaque lettre.

### 1. Créer une référence et accéder à sa valeur

```jsx
const prefixRef = useRef(null);
```

`useRef` retourne un objet dont la propriété `current` contient la valeur mémorisée :

```jsx
// Au départ :
prefixRef.current; // null

// Pour changer la valeur :
prefixRef.current = 'Bonjour';
```

- `null` : valeur initiale de la référence.
- `prefixRef` : le même objet est conservé entre les rendus du composant.
- `prefixRef.current` : valeur que l'on peut lire et modifier.
- Une modification de `current` ne demande pas à React de refaire le rendu.

**Important :** une référence est conservée pendant la vie du composant. Elle est recréée si celui-ci est démonté puis remonté.

### 2. Comprendre la différence avec useState

Dans l'exercice, le champ reste contrôlé par un state :

```jsx
const [prefix, setPrefix] = useState('');

// Dans le JSX :
<Input value={prefix} onChange={setPrefix} />
```

| `useState` | `useRef` |
|---|---|
| Conserve une valeur entre les rendus | Conserve une valeur entre les rendus |
| Se modifie avec un setter | Se modifie avec `.current` |
| Une nouvelle valeur demande un rendu | Modifier `.current` ne déclenche pas de rendu |
| Adapté aux données affichées dans l'interface | Adapté aux valeurs utilisées par des callbacks ou aux références DOM |

**Pourquoi utiliser les deux ici ?** Le state `prefix` contrôle le texte affiché dans le champ. La référence permet au callback de l'intervalle de lire le texte récent sans réinstaller cet intervalle.

### 3. Comprendre le problème d'une ancienne valeur capturée

Sans référence, on pourrait écrire :

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log(prefix);
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

Mais ce code lit `prefix` depuis le rendu qui a installé l'effet. Comme `[]` ne provoque pas de réinstallation à chaque changement de texte, le callback conserve ici la valeur initiale, une chaîne vide.

**Ce n'est pas le state qui ne se met pas à jour :** les rendus suivants ont bien un nouveau `prefix`, mais l'ancien callback utilise encore celui du premier rendu. C'est une **fermeture obsolète** (*stale closure*).

Ajouter `[prefix]` corrigerait la lecture, mais annulerait et recréerait l'intervalle à chaque saisie. Dans cet exercice, la référence permet de garder l'intervalle installé tout en lisant une valeur actualisée.

### 4. Lire la référence depuis l'intervalle

Dans le code de l'exercice, on retrouve :

```jsx
const prefixRef = useRef(null);
const [prefix, setPrefix] = useState('');
prefixRef.current = prefix;

useEffect(() => {
  const timer = setInterval(() => {
    console.log(prefixRef.current);
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

Le callback conserve une référence vers **le même objet `prefixRef`**, puis consulte sa propriété `current` à chaque déclenchement. Il ne conserve donc pas simplement une copie du texte initial.

**Point à améliorer :** l'affectation `prefixRef.current = prefix` est actuellement faite pendant le rendu. Il vaut mieux éviter de lire ou modifier une référence pendant le rendu, sauf pour une initialisation prévisible. Pour cet exemple, on peut synchroniser la référence dans un effet déclaré avant celui de l'intervalle :

```jsx
const [prefix, setPrefix] = useState('');
const prefixRef = useRef(prefix);

useEffect(() => {
  prefixRef.current = prefix;
}, [prefix]);

useEffect(() => {
  const timer = setInterval(() => {
    console.log(prefixRef.current);
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

- Le premier effet actualise la référence après un changement de `prefix`.
- Le second installe l'intervalle, sans le recréer à chaque saisie.
- Le nettoyage arrête l'intervalle au démontage et évite son accumulation, notamment avec les vérifications de `StrictMode` en développement.

### 5. Suivre le fonctionnement étape par étape

1. Le composant est monté avec `prefix` égal à `''`.
2. La référence contient également `''`, et l'intervalle est installé.
3. L'utilisateur écrit `Bonjour` : `Input` appelle `setPrefix` à chaque saisie.
4. React refait le rendu avec le nouveau texte dans le champ.
5. La référence est actualisée avec le texte récent.
6. Au prochain déclenchement, l'intervalle lit `prefixRef.current` et affiche `Bonjour` dans la console.
7. Le composant disparaît : le nettoyage appelle `clearInterval(timer)`.

**À noter :** l'intervalle écrit dans la console du navigateur, pas dans la page. Le paragraphe « Lorem ipsum » ne dépend pas de la référence.

### 6. Autre utilisation fréquente : accéder à un élément HTML

Une référence peut aussi contenir un élément DOM, par exemple pour placer le curseur dans un champ après un clic :

```jsx
function FocusExample() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return <div>
    <input ref={inputRef} />
    <button onClick={handleFocus}>Placer le curseur</button>
  </div>;
}
```

- `ref={inputRef}` : React place l'élément `<input>` dans `inputRef.current` lorsqu'il est ajouté au DOM.
- `.focus()` : donne le focus au champ.
- `?.` : évite l'appel si la référence vaut `null`.
- React remet la référence à `null` lorsque l'élément est retiré.

Cet exemple utilise directement un `<input>` natif. Le composant personnalisé `Input` de l'exercice ne transmet pas actuellement de prop `ref` à son champ interne.

### 7. Bonnes pratiques et erreurs à éviter

- **Ne pas remplacer un state d'affichage par une ref.** Écrire `counterRef.current += 1` ne rafraîchit pas un compteur affiché dans le JSX.
- **Ne pas lire une ref comme source d'affichage dans le rendu.** Si une valeur doit déterminer l'interface, utiliser un state.
- **Lire et modifier les références dans les handlers ou les effets**, plutôt que pendant le rendu.
- **Ne pas utiliser une ref pour masquer des dépendances manquantes.** Dans cet exercice, l'effet de synchronisation dépend bien de `[prefix]`. La référence sert précisément à fournir la valeur récente à un callback durable.
- **Toujours nettoyer les ressources installées.** Une ref ne remplace pas le `clearInterval` nécessaire pour un timer.
- **Distinguer `useRef` et `useMemo`.** Une ref conserve un objet mutable ; `useMemo` met en cache le résultat d'un calcul selon ses dépendances.

**À retenir :** `useState` sert aux valeurs qui font évoluer l'interface. `useRef` conserve une valeur ou un élément DOM sans provoquer de rendu. Dans cet exercice, la référence donne accès au texte récent depuis un intervalle qui reste installé pendant la saisie.

## 8. Les hooks personnalisés — Réutiliser une logique React

Un hook personnalisé est **une fonction dont le nom commence par `use` et qui peut utiliser d'autres hooks** pour regrouper une logique réutilisable.

Au lieu d'écrire la gestion d'un compteur, d'un titre ou d'une requête directement dans chaque composant, on la place dans un fichier du dossier `src/hooks`.

**Important :** un hook personnalisé partage une logique, pas automatiquement un état. Deux composants qui appellent `useToggle()` possèdent chacun leur propre état.

### 1. useToggle — Basculer entre true et false

```jsx
export function useToggle(initial = false) {
  const [state, setState] = useState(initial);
  const toggle = () => setState(v => !v);

  return [state, toggle];
}
```

**Fonctionnement :**

- `initial = false` : valeur de départ si aucun argument n'est fourni.
- `useState(initial)` : mémorise le booléen.
- `v => !v` : reçoit la valeur précédente et l'inverse.
- `return [state, toggle]` : fournit la valeur et une fonction pour la modifier.

Dans `App`, l'exemple de checkbox est actuellement commenté :

```jsx
const [checked, toggleCheck] = useToggle();

// Dans le JSX :
<input type="checkbox" checked={checked} onChange={toggleCheck} />
{checked && 'Je suis coché'}
```

1. `checked` commence à `false`.
2. Un clic appelle `toggleCheck`.
3. L'état passe à `true` et React refait le rendu.
4. La case est cochée et le texte apparaît.
5. Un autre clic inverse à nouveau l'état.

Les noms `checked` et `toggleCheck` sont choisis lors de la déstructuration du tableau. Ils correspondent aux positions de `state` et `toggle` dans le résultat du hook.

### 2. useIncrement — Encapsuler un compteur avec des limites

```jsx
export function useIncrement({base = 0, max = Infinity, min = -Infinity}) {
  const [state, setState] = useState(base);

  return {
    count: state,
    increment: () => setState(v => v < max ? v + 1 : v),
    decrement: () => setState(v => v > min ? v - 1 : v)
  };
}
```

Utilisation dans `App` :

```jsx
const {count, increment, decrement} = useIncrement({
  base: 0,
  max: 10,
  min: 0
});

// Dans le JSX :
<p>Compteur {count}</p>
<button onClick={increment} type="button">Incrémenter</button>
<button onClick={decrement} type="button">Décrémenter</button>
```

- `base` : valeur initiale du compteur.
- `max` et `min` : bornes vérifiées avant chaque variation de `1`.
- `v < max ? v + 1 : v` : augmente si possible, sinon conserve la valeur.
- `v > min ? v - 1 : v` : diminue si possible, sinon conserve la valeur.
- Les mises à jour fonctionnelles utilisent la dernière valeur disponible du state.

Ici, le compteur démarre à `0` et évolue entre `0` et `10`. Le hook suppose une configuration cohérente : il ne corrige pas une valeur initiale située hors des bornes et ne valide pas des bornes décimales.

**Pourquoi retourner un objet ?** Les trois résultats ont des noms explicites. Contrairement à un tableau, l'ordre de déstructuration n'a pas d'importance : `{increment, count, decrement}` fonctionnerait aussi.

### 3. useDocumentTitle — Modifier le titre et restaurer sa valeur initiale

```jsx
export function useDocumentTitle(title) {
  const titleRef = useRef(document.title);

  useEffect(() => {
    return () => {
      document.title = titleRef.current;
    };
  }, []);

  useEffect(() => {
    document.title = title ? title : titleRef.current;
  }, [title]);
}
```

Dans `App` :

```jsx
const [name, setName] = useState('');

useDocumentTitle(name ? `Editer ${name}` : null);

// Dans le JSX :
<Input value={name} onChange={setName} label="Name" />
```

**Fonctionnement étape par étape :**

1. La référence conserve le titre d'origine pendant la vie du composant.
2. Le premier effet prévoit sa restauration au démontage.
3. L'utilisateur saisit `Alice` : `setName` modifie le state et provoque un rendu.
4. Le hook reçoit `Editer Alice`.
5. L'effet dépendant de `[title]` met à jour le titre de l'onglet.
6. Si le champ est vidé, le hook reçoit `null` et rétablit le titre initial.
7. Si le composant est démonté, le nettoyage restaure aussi ce titre.

Ce hook réunit les rôles de plusieurs hooks : le state du composant suit la saisie, la ref conserve le titre initial sans déclencher de rendu, et les effets synchronisent le titre du navigateur.

**À noter :** `useDocumentTitle` n'a pas besoin de retourner une valeur. Son rôle est d'effectuer une synchronisation. Cette version utilise `document` et vise une exécution dans le navigateur.

### 4. useFetch — Regrouper le chargement de données

Dans `App`, les articles sont demandés avec :

```jsx
const {loading, data, errors} = useFetch(
  'https://jsonplaceholder.typicode.com/posts?_limit=10&_delay=2000'
);
```

Le hook possède trois états :

```jsx
const [loading, setLoading] = useState(true);
const [data, setData] = useState(null);
const [errors, setErrors] = useState(null);
```

| État | Rôle | Valeur initiale |
|---|---|---|
| `loading` | Indiquer si la requête est en cours | `true` |
| `data` | Conserver les données reçues | `null` |
| `errors` | Conserver une erreur interceptée | `null` |

Ces informations sont distinctes : le composant doit pouvoir afficher une attente, les résultats ou une erreur.

Le code de chargement de l'exercice est :

```jsx
useEffect(() => {
  fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json; charset=UTF-8',
      ...options.headers
    }
  })
    .then(r => r.json())
    .then(data => {
      setLoading(false);
      setData(data);
    })
    .catch(e => {
      setErrors(e);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

return {loading, data, errors};
```

**Fonctionnement étape par étape :**

1. Au premier rendu, `loading` vaut `true` : le composant peut afficher un message d'attente.
2. Après le rendu, l'effet lance `fetch`.
3. `...options` transmet les options de la requête, et `...options.headers` complète ou remplace les en-têtes définis par défaut.
4. `r.json()` lit la réponse et convertit son contenu JSON en données JavaScript. Cette opération est elle aussi asynchrone.
5. En cas de succès, `setData(data)` conserve les articles et demande un nouveau rendu.
6. Si une promesse échoue, `catch` conserve l'erreur avec `setErrors`.
7. `finally` met fin à l'attente, que la requête ait réussi ou échoué.
8. Le hook retourne les valeurs actuelles des trois états à chaque rendu.

**Important :** les setters dans les callbacks de la requête sont utiles : ils permettent à React de tenir compte du résultat d'une opération extérieure. Ce n'est pas une simple copie d'état inutile dans un effet.

### 5. Afficher les différentes étapes du chargement

```jsx
{loading && <div>Loading...</div>}
{errors && <div>{errors.toString()}</div>}
{data && <div>
  <ul>
    {data.map(post => (
      <li key={post.id}>{post.title}</li>
    ))}
  </ul>
</div>}
```

- `loading && ...` : affiche l'attente lorsque le chargement est actif.
- `errors && ...` : affiche l'erreur si elle existe.
- `data && ...` : évite d'appeler `.map()` sur la valeur initiale `null`.
- `data.map(...)` : transforme les articles en éléments de liste.
- `key={post.id}` : donne à React une clé stable pour identifier chaque article.

Ici, le composant suppose que la réponse JSON est un tableau d'articles. Une autre API pourrait renvoyer un objet nécessitant une lecture différente.

### 6. Règles et bonnes pratiques des hooks personnalisés

- Commencer leur nom par `use` : `useToggle`, `useFetch`, etc.
- Les appeler au premier niveau d'un composant ou d'un autre hook, jamais dans une condition, une boucle ou un handler.
- Regrouper une logique cohérente et nommer le hook selon ce qu'il fait.
- Retourner uniquement les valeurs et fonctions nécessaires au composant.
- Garder les dépendances et nettoyages des effets corrects : déplacer le code dans un hook ne supprime pas ces obligations.
- Se rappeler que chaque appel possède ses propres états et références.

**À retenir :** un hook personnalisé permet d'écrire « ce dont le composant a besoin » avec des appels comme `useToggle()` ou `useFetch(url)`, tandis que les détails restent dans les hooks. Il ne remplace pas `useState`, `useEffect` ou `useRef` : il les assemble pour rendre une logique plus facile à lire et à réutiliser.

## 9. Mémoïsation et useCallback — Éviter des rendus inutiles

Cette partie montre comment associer **`memo` et `useCallback`** pour permettre à un composant enfant de réutiliser son rendu lorsque ses props n'ont pas changé.

Dans l'exercice, `App` contient un champ « Prénom », affiche sa valeur en majuscules et transmet une fonction de clic à un bloc d'information `InfoMemo`.

### 1. Comprendre pourquoi le composant enfant se réexécute

```jsx
const [name, setName] = useState('');

<Input label="Prénom" onChange={setName} value={name} />
<div>{name.toUpperCase()}</div>
```

1. L'utilisateur modifie le champ.
2. `Input` appelle `setName` avec le texte saisi.
3. React réexécute `App` pour calculer le nouvel affichage.
4. Par défaut, React effectue aussi le rendu des composants enfants.

Même si le texte du bloc d'information est fixe, sa fonction de composant peut donc être rappelée. Un rendu React ne signifie pas nécessairement que le DOM du navigateur est modifié : React applique les changements nécessaires à l'interface.

### 2. memo — Réutiliser le rendu d'un composant

```jsx
const InfoMemo = memo(function Info({onClick}) {
  console.log('Info', 'render');

  return <div className="alert alert-info" onClick={onClick}>
    Lorem ipsum dolor sit amet, consetetur adipiscing elit.
  </div>;
});
```

- `memo` enveloppe un composant pour permettre à React d'éviter un rendu provoqué par son parent si ses props sont identiques.
- `console.log('Info', 'render')` permet d'observer les appels du composant dans la console.
- Ici, la prop à comparer est `onClick`.
- `memo` est une fonction React, pas un hook.

**Important :** `memo` est une optimisation, pas une garantie qu'un composant ne sera jamais réexécuté. Un changement de son propre state ou d'un contexte qu'il utilise peut toujours provoquer un rendu.

### 3. Pourquoi memo seul ne suffit pas avec une fonction recréée

Sans `useCallback`, on pourrait écrire dans `App` :

```jsx
const handleClick = () => {
  console.log(name.length);
};

// Dans le JSX :
<InfoMemo onClick={handleClick} />
```

À chaque exécution de `App`, JavaScript crée une nouvelle fonction `handleClick`. Son code peut être identique, mais son identité est différente :

```jsx
const first = () => {};
const second = () => {};

first === second; // false
```

Pour `memo`, la prop `onClick` a donc changé. React ne peut pas éviter ce rendu sur la base de props identiques.

La comparaison par défaut se fait prop par prop avec `Object.is`. Les objets, tableaux et fonctions sont comparés selon leur identité, sans analyser tout leur contenu.

### 4. useCallback — Conserver l'identité d'une fonction

Le code de l'exercice utilise :

```jsx
const handleClick = useCallback(() => {
  console.log(name.length);
}, [name.length]);
```

On peut lire cette écriture ainsi :

> « Fournis la même fonction tant que la longueur du prénom ne change pas. »

- La fonction sera exécutée lors du clic, pas lors de l'appel à `useCallback`.
- `[name.length]` indique la valeur dont dépend son résultat dans cet exemple.
- Si la longueur est identique, React peut retourner la fonction précédemment conservée.
- Si la longueur change, React retourne la nouvelle fonction fournie par ce rendu.

**Nuance :** une fonction fléchée est toujours créée dans l'expression exécutée par `App`. `useCallback` permet de réutiliser l'identité de la fonction précédente ; il ne rend pas son exécution plus rapide.

### 5. Suivre le comportement de l'exercice

```jsx
<InfoMemo onClick={handleClick} />
```

| Action | Longueur du prénom | Conséquence attendue de l'optimisation |
|---|---:|---|
| Premier affichage | 0 | `InfoMemo` effectue son rendu |
| Saisir `Alice` | 5 | La dépendance change : nouvelle fonction et rendu de l'enfant |
| Remplacer `Alice` par `Marie` | 5 | Même longueur : fonction conservée, rendu de l'enfant évitable |
| Remplacer `Marie` par `Paul` | 4 | Nouvelle longueur : nouvelle fonction et rendu de l'enfant |
| Cliquer sur le bloc | 4 | Le callback affiche `4` dans la console |

Dans tous les cas, `App` se réexécute lorsque `name` change et le prénom en majuscules est actualisé. L'optimisation concerne le composant enfant.

**Pourquoi garder une fonction liée à un ancien prénom peut fonctionner ici ?** Si `Alice` est remplacé par `Marie`, la fonction conservée peut encore capturer `Alice`. Mais elle ne fait qu'afficher sa longueur : `5` est aussi la longueur de `Marie`.

Pour rendre cette intention plus explicite, on peut extraire la longueur :

```jsx
const nameLength = name.length;

const handleClick = useCallback(() => {
  console.log(nameLength);
}, [nameLength]);
```

Si le callback doit afficher le prénom lui-même, il faut dépendre de `[name]` :

```jsx
const handleClick = useCallback(() => {
  console.log(name);
}, [name]);
```

**Important :** les dépendances doivent correspondre aux données réellement utilisées. Les réduire artificiellement pour éviter un rendu risque de conserver des valeurs obsolètes.

### 6. Distinguer memo, useMemo et useCallback

| Outil | Ce qui est réutilisé | Exemple |
|---|---|---|
| `memo` | Le rendu d'un composant quand ses props sont identiques | `memo(Info)` |
| `useMemo` | Le résultat d'un calcul | `useMemo(() => calculate(data), [data])` |
| `useCallback` | L'identité d'une fonction | `useCallback(() => doSomething(value), [value])` |

**À retenir :** `useMemo` fournit le résultat d'une fonction ; `useCallback` fournit la fonction elle-même, qui pourra être appelée plus tard.

### 7. Quand utiliser cette optimisation ?

Cette association devient intéressante lorsqu'un enfant coûteux à rendre reçoit des props souvent identiques, alors que son parent se réexécute fréquemment.

Dans l'exercice, le bloc de texte est simple et le clic ne fait qu'un `console.log` : l'intérêt est surtout pédagogique. Il n'est pas nécessaire de placer `memo` et `useCallback` partout.

- Ne pas utiliser ces outils pour corriger une logique incorrecte : le composant doit fonctionner sans cette optimisation.
- Un callback stable ne suffit pas à empêcher les rendus d'un enfant ordinaire : ici, c'est son association avec `memo` qui permet d'en éviter.
- Une autre prop recréée à chaque rendu, comme un objet ou un tableau, peut empêcher `memo` de réutiliser le rendu.
- En développement avec `StrictMode`, React peut appeler les composants plusieurs fois pour détecter des erreurs. Les logs ne correspondent donc pas toujours à un seul appel par interaction.

**À retenir :** commencer par une logique simple qui fonctionne. Si des rendus inutiles deviennent coûteux, `memo` peut optimiser l'enfant et `useCallback` stabiliser les fonctions qui lui sont transmises.
