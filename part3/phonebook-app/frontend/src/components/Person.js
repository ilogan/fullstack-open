import React from "react";

const Person = ({ name, number, id, handleClick }) => {
  return (
    <div>
      {name} {number} <button onClick={() => handleClick(id)}>Delete</button>
    </div>
  );
};

export default Person;
