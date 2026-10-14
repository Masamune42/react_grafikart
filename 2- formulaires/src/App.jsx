import React from "react";

function App() {

  const [firstName, setFirstName] = React.useState("John Doe");

  // Méthode 1 : En utilisant un champ controlé par React
  // const handleChange = (e) => {
  //   setFirstName(e.target.value);
  // }
  //
  // const reset = () => {
  //   setFirstName('')
  // }
  //
  // return <form>
  //   <input type="text" name="firstname" value={firstName} onChange={handleChange} />
  //   {firstName}
  //   <button onClick={reset} type="button">Reset</button>
  // </form>


  // Méthode 2 : Pas de champ controlé

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log(new FormData(ev.target));
  }

  return <form onSubmit={handleSubmit}>
    <input type="text" name="firstName" defaultValue="John Doe"/>
    <button type="submit">Submit</button>
  </form>
}

export default App