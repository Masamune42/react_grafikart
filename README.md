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