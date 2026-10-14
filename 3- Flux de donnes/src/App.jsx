import React from "react";

function App() {

  const [isTermAccepted, setIsTermAccepted] = React.useState(false);

  return <form>
    <CGUCheckbox checked={isTermAccepted} onCheck={setIsTermAccepted} />
    <button disabled={!isTermAccepted}>Envoyer le formulaire</button>
  </form>

  function CGUCheckbox({checked, onCheck}) {
    return <div>
      <label>
        <input
            type="checkbox"
            onChange={(e) => onCheck(e.target.checked)}
            checked={checked} />
        Accepter les conditions d'utilisation
      </label>
    </div>
  }

}

export default App