import { useState } from 'react'

function App() {
  const [isTermAccepted, setIsTermAccepted] = useState(false)

  // Formulaire
  return <form>
      <CGUCheckbox checked={isTermAccepted} onCheck={setIsTermAccepted} />
      <button disabled={!isTermAccepted}>Envoyer le formulaire</button>
    </form>
}

// Permet de gérer un input checkbox pour activer/désactiver le bouton de validation
// On passe la propriété onCheck en callback pour faire remonter le setIsTermAccepted afin de changer l'état du input
// 1. Je coche la case et j'appelle onCheck en lui passant une valeur true ou false
// 2. onCheck est branché au setIsTermAccepted (le composant enfant change l'état du composant parent) et va changer la valeur de false à true
// 3. La cace sera coché et donc le bouton réactivé
function CGUCheckbox({checked, onCheck}) {
  return <div>
    <label>
      <input type="checkbox" onChange={(e) => onCheck(e.target.checked)} checked={checked} />
      Accepter les conditions d'utilisation
    </label>
  </div>
}

export default App
