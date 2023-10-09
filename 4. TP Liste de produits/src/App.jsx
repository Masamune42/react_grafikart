import { useState } from "react"
import { Checkbox } from "./components/forms/checkbox"
import { Input } from "./components/forms/input"
import { ProductRow } from "./components/products/ProducROw"
import { ProductCategoryRow } from "./components/products/ProductCategoryRow"

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
]

function App() {

  // Etat pour afficher ou non les éléments en stocks
  const [showStockedOnly, setShowStockedOnly] = useState(false)
  // Etat de la recherche
  const [search, setSearch] = useState('')

  // Tableau qui détermine les produits à afficher par filtrage
  const visibleProducts = PRODUCTS.filter(product => {
    // Si checkbox cochée ET que le produit n'est pas en stock => ne pas garder l'élément
    if(showStockedOnly && !product.stocked) {
      return false
    }

    // Si on cherche un élément ET que le nom du produit ne correspond pas => ne pas garder l'élément
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

export default App
