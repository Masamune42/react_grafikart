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
