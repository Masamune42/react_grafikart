import React from "react";

function App() {

  const [person, setPerson] = React.useState({
    firstname: 'John',
    lastname: 'Doe',
    age: 18
  });

  const increment = () => {
    setPerson({...person, age: person.age + 1});
  }

  return <>
    <p>Age de {person.firstname} : {person.age}</p>
    <button onClick={increment}>Gagner une année</button>
  </>
}

export default App