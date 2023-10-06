import { useState } from 'react'

function App() {

  // Methode 1 : champ complétement géré par React
  // Inconvenient : à chaque fois que l'on tape, on rerend le composant => beaucoup de code à exécuter
  // A utiliser si on veut changer un élément dans l'interface à chaque fois qu'un utilisateur tape quelque chose
  const [firstname, setFirstname] = useState('John Doe')
  const [value, setValue] = useState('')

  const handleChange = (e) => {
    setFirstname(e.target.value)
  }

  const [checked, setChecked] = useState(true)
  const toggleCheck = () => {
    setChecked(!checked)
  }

  const reset = () => {
    setFirstname('')
  }

  // Règle : ne pas mettre de value à undefined mais plutôt une chaine de caractères vide
  return (
    <>
      <form action="">
        <input type="text" name='firstname' value={firstname} onChange={handleChange} />
        <textarea value={value} onChange={handleChange}></textarea>
        {/* Checkbox qui disable le bouton d'envoi si décoché via toggleCheck */}
        <input type="checkbox" checked={checked} onChange={toggleCheck} />
        <button disabled={!checked} onClick={reset} type='button'>Reset</button>
      </form>
    </>
  )

  // Méthode 2 : Champ non contrôlé par React
  // A utiliser si on peut taper dans le champ de manière libre + d'avoir les valeurs qu'on a soumis
  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   console.log(new FormData(e.target))
  // }

  // return <form onSubmit={handleSubmit}>
  //       <input type="text" name='firstname' defaultValue="John Doe" />
  //       <button  type='submit'>Envoyer</button>
  //     </form>
}

export default App
