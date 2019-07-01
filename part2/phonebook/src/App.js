import React, { useState, useEffect } from "react";

import personService from "./services/persons";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const handleFilterChange = event => {
    setFilter(event.target.value);
  };

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleNumberChange = event => {
    setNewNumber(event.target.value);
  };

  const updatePerson = existingPerson => {
    const changedPerson = { ...existingPerson, number: newNumber };
    personService
      .update(changedPerson.id, changedPerson)
      .then(returnedPerson =>
        setPersons(
          persons.map(person =>
            person.id !== changedPerson.id ? person : returnedPerson
          )
        )
      );
  };

  const handleAddClick = event => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);
    if (existingPerson) {
      const msg = `${
        existingPerson.name
      } is already added to the phonebook, replace the old number with a new one?`;

      if (window.confirm(msg)) {
        updatePerson(existingPerson);
        setNewName("");
        setNewNumber("");
      }
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber
    };

    personService.create(newPerson).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
    });
  };

  const handleDeleteClick = id => {
    const person = persons.find(person => person.id === id);

    if (window.confirm(`Delete ${person.name} with id ${id}?`)) {
      personService.deletePerson(id).then(status => {
        if (status === 200) {
          setPersons(persons.filter(person => person.id !== id));
        }
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleClick={handleAddClick}
      />
      <h2>Numbers</h2>
      <PersonList
        persons={persons}
        filter={filter}
        handleClick={handleDeleteClick}
      />
    </div>
  );
};

export default App;
