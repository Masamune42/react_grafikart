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
