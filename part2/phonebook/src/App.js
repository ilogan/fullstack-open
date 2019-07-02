import React, { useState, useEffect } from "react";

import personService from "./services/persons";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import Notification from "./components/Notification";

import "./index.css";

const App = () => {
  /* STATE MANAGEMENT */
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState({ content: null, success: false });

  /* MOUNTING */
  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  /*  MESSAGE UTILITIES */
  const successTimeout = (message, seconds) => {
    setMessage({ content: message, success: true });
    setTimeout(() => {
      setMessage({ content: null, success: false });
    }, seconds * 1000);
  };

  const errorTimeout = (message, seconds) => {
    setMessage({ content: message, success: false });
    setTimeout(() => {
      setMessage({ content: null, success: false });
    }, seconds * 1000);
  };

  /* FORM HANDLING */
  const handleFilterChange = event => {
    setFilter(event.target.value);
  };

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleNumberChange = event => {
    setNewNumber(event.target.value);
  };

  /* CREATE AND UPDATE */
  const updatePerson = existingPerson => {
    const changedPerson = { ...existingPerson, number: newNumber };
    personService
      .update(changedPerson.id, changedPerson)
      .then(returnedPerson => {
        setPersons(
          persons.map(person =>
            person.id !== returnedPerson.id ? person : returnedPerson
          )
        );
        successTimeout(`Updated ${returnedPerson.name}`, 5);
        setNewName("");
        setNewNumber("");
      });
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
      }
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber
    };

    personService.create(newPerson).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson));
      successTimeout(`Created ${returnedPerson.name}`, 5);
      setNewName("");
      setNewNumber("");
    });
  };

  /* DELETE */
  const handleDeleteClick = id => {
    const person = persons.find(person => person.id === id);

    if (window.confirm(`Delete ${person.name} with id ${id}?`)) {
      personService.deletePerson(id).then(status => {
        setPersons(persons.filter(person => person.id !== id));
        successTimeout(`Deleted ${person.name}`, 5);
      });
    }
  };

  /* RENDER */
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
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
