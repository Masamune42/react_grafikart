import { useState } from "react"
import { useIncrement } from "./hooks/useIncrement"
import { useToggle } from "./hooks/useToggle"
import { useDocumentTitle } from "./hooks/useDocumentTitle"
import { Input } from "./components/forms/input"
import { useFetch } from "./hooks/useFetch"

function App() {

  const [checked, toggleCheck] = useToggle()

  const {count, increment, decrement} = useIncrement({
    base: 0,
    max: 10,
    min: 0
  })

  const [name, setName] = useState('')

  useDocumentTitle(name ? `Editer ${name}` : null)

  const {loading, data, errors} = useFetch('https://jsonplaceholder.typicode.com/posts?_delay=2000&_limit=10')

  return <div>
    <div>
      <Input value={name} onChange={setName} label="Nom" />
      <input type="checkbox" value={checked} onChange={toggleCheck} />
      {checked && 'Je suis coché'}
      Compteur {count}
      <button onClick={decrement}>Décrémenter</button>
      <button onClick={increment}>Incrémenter</button>
    </div>
    <div className="container my-2">
      {loading && <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
      </div>}
      {errors && <div className="alert alert-danger">{errors.toString()}</div>}
      {data && <div>
        <ul>
          {data.map(post => (<li key={post.id}>{post.title}</li>))}
        </ul>
      </div>}
    </div>
  </div>
}

export default App
