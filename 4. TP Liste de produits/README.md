# TP : liste de produits
Vidéo : https://www.youtube.com/watch?v=elMAnc8lH_I&list=PLjwdMgw5TTLUEOKPg5Z5TgwAOeWkjGL69&index=8

## 1. Réfléchir au découpage par composant
2 éléments à créer :
- SearchBar : recherche des éléments + case à cocher >
    - Input : champ de recherche
    - Checkbox : case à cocher
- ProducTable : affichage de la liste des produits >
    - ProductCategoryRow : Afficher l'entête de la catégorie
    - ProductRow : Affichage d'une ligne d'un produit

## 2. Création des composants (sans se soucier des états)
- Création de \src\components\forms\input.jsx
```jsx
/**
 * 
 * @param {string} palceholder 
 * @param {string} value 
 * @param {(s: string) => void} onChange 
 */
export function Input({placeholder, value, onChange}) {
    return <div>
        <input
            type="text"
            className="form-control"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
}
```
- Création de \src\components\forms\checkbox.jsx
```jsx
/**
 * 
 * @param {string} palceholder 
 * @param {(s: string) => void} onChange 
 * @param {string} label 
 * @param {string} id 
 */
export function Checkbox({checked, onChange, label, id}) {
    return <div className="form-check">
        <input
            id={id}
            type="checkbox"
            className="form-check-input"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor={id} className="form-check-label">{label}</label>
    </div>
}
```

- Création de la fonction SearchBar (le onChange n'est pas encore géré)
```jsx
function SearchBar ({showStockedOnly, onStockOnlyChange, search, onSearchChange}) {
  return <div>
    <div className="mb-3">
      <Input
        value={search}
        onChange={onSearchChange}
        placeholder="Rechercher..."
      />
      <Checkbox
        id="stocked"
        checked={showStockedOnly}
        onChange={() => null}
        label="N'afficher que les produits en stock"
      />
    </div>
  </div>
}
```

- Création de \src\components\products\ProducRow.jsx
```jsx
/**
 * Ligne porduit dans un tableau à 2 colonnes (nom / prix)
 * 
 * @param {{name: string, stocked: boolean, price: string}} product 
 */
export function ProductRow({product}) {

    const style = product.stocked ? undefined : {color: 'red'}

    return <tr>
        <td style={style}>{product.name}</td>
        <td>{product.price}</td>
    </tr>
}
```

- \src\components\products\ProductCategoryRow.jsx
```jsx
/**
 * Ligne de tableau avec nom de la catégorie
 * 
 * @param {string} name 
 */
export function ProductCategoryRow({name}) {
    return <tr>
        <td colSpan={2}><strong>{name}</strong></td>
    </tr>
}
```

## 3. Création du composant qui les regroupe tous
```jsx
// Fonction qui affiche le tableau en recevant les produits en entrée
function ProductTable ({products}) {

  // Tableau de composants
  const rows = []
  let lastCategory = null

  // On boucle pour créer les lignes à afficher dans le tableau
  for (let product of products) {
    // Si la précédente catégorie est différente de celle actuelle, on va pousser un élément ProductCategoryRow pour afficher le nom de la catégorie
    if (product.category !== lastCategory)
      rows.push(<ProductCategoryRow key={product.category} name={product.category} />)

    lastCategory = product.category
    // On ajoute une ligne de produit avec les paramètres et une clé
    rows.push(<ProductRow product={product} key={product.name} />)
  }

  // On retourne le tableau
  return <table className="table">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Prix</th>
      </tr>
    </thead>
    <tbody>
      {rows}
    </tbody>
  </table>
}
```

## 4. Système de recherche
- On va se poser la question de qui a besoin d'avoir l'information de recherche.
- On en aura besoin dans la SearchBar pour la recherche et dans le ProductTable pour afficher ou non les produits en stock
- On va placer la logique dans le composant parent dans ce cas
```jsx
function App() {

  const [showStockedOnly, setShowStockedOnly] = useState(false)
  const [search, setSearch] = useState('')

  const visibleProducts = PRODUCTS.filter(product => {
    if(showStockedOnly && !product.stocked) {
      return false
    }

    if(search && !product.name.includes(search)) {
      return false
    }

    return true
  })

  return <div className="container my-3">
    <SearchBar
      search={search}
      onSearchChange={setSearch}
      showStockedOnly={showStockedOnly}
      onStockOnlyChange={setShowStockedOnly}
    />
    <ProductTable products={visibleProducts} />
  </div>
}
```
- On change la fonction SearchBar en conséquence
```jsx
function SearchBar ({showStockedOnly, onStockOnlyChange, search, onSearchChange}) {
  return <div>
    <div className="mb-3">
      <Input
        value={search}
        onChange={onSearchChange}
        placeholder="Rechercher..."
      />
      <Checkbox
        id="stocked"
        checked={showStockedOnly}
        onChange={onStockOnlyChange}
        label="N'afficher que les produits en stock"
      />
    </div>
  </div>
}
```