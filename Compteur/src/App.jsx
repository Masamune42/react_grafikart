import { useState } from "react"

function App() {

  const [count, setCount] = useState(0)
  const [person, setPerson] = useState({
    firstName: 'John',
    lastName: 'Doe',
    age: 18
  })

  const incrementAge = () => {
    // On récupère toutes les propriétés de l'objet person et on change la valeur de de l'age
    setPerson({...person , age: person.age + 1})
  }

  const incrementCount = () => {
    // On récupère toutes les propriétés de l'objet person et on change la valeur de de l'age
    setCount(count + 1)
  }

  return <>
    <p>Age de {person.firstName} : {person.age}</p>
    <button onClick={incrementAge}>Gagner une année</button>
    <button onClick={incrementCount}>Incrémenter : {count}</button>
  </>
}

export default App
