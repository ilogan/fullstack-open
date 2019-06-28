import React, { useState } from "react";

const App = () => {
  // add button should add a new person to the list
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  // new name should be the name within form up until submit
  const [newName, setNewName] = useState("");

  const handleChange = event => {
    setNewName(event.target.value);
  };

  const handleClick = event => {
    event.preventDefault();
    if (persons.find(person => person.name === newName)) {
      return alert(`${newName} is already added to the phonebook`);
    }
    setPersons(persons.concat({ name: newName }));
    setNewName("");
  };

  const personList = persons.map(person => (
    <div key={person.name}>{person.name}</div>
  ));

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleChange} />
        </div>
        <div>
          <button type="submit" onClick={handleClick}>
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personList}
    </div>
  );
};

export default App;
