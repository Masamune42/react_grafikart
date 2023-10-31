import { memo, useState } from "react"
import { Input } from "./components/forms/input"

function App() {
  const [name, setName] = useState('')

  return <div className="container my-2 vstack gap-2">
    {/* On va faire un rendu de tout ce qui se trouver dans la div donc on sépare le 1er morceau de code en fonction (solution 1) */}
    {/* <Demo /> */}
    <div>
      <Input label="Prénom" onChange={setName} />
      <div>
        {name.toUpperCase()}
      </div>
    </div>
    <InfoMemo />
  </div>
}

function Demo() {
  const [name, setName] = useState('')
  return <div>
    <Input label="Prénom" onChange={setName} />
    <div>
      {name.toUpperCase()}
    </div>
  </div>
}

// Fonction pour la solution 1
// function Info() {
//   return <div className="alert alert-info">
//     Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam maiores quae ex minus fugiat harum.
//   </div>
// }

// Solution 2 : on utilise la fonction memo à condition qu'on ne passe pas le paramètre qui a besoin d'être rerendu
const InfoMemo = memo(function Info() {
  return <div className="alert alert-info">
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam maiores quae ex minus fugiat harum.
  </div>
})

export default App
