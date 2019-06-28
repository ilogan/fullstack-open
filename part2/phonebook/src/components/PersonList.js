import React from "react";

import Person from "./Person";

const PersonList = ({ persons, filter }) => {
  const personList = persons
    .filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    .map(person => (
      <Person key={person.name} name={person.name} number={person.number} />
    ));

  return <div>{personList}</div>;
};

export default PersonList;
