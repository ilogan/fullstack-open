import React from "react";

import Person from "./Person";

const PersonList = ({ persons, filter, handleClick }) => {
  const personList = persons
    .filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    .map(person => (
      <Person
        key={person.id}
        name={person.name}
        number={person.number}
        id={person.id}
        handleClick={handleClick}
      />
    ));

  return <div>{personList}</div>;
};

export default PersonList;
