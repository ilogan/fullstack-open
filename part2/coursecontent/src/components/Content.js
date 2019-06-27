import React from "react";

import Part from "./Part";

const Content = ({ parts }) => {
  const partList = parts.map(part => (
    <Part id={part.id} name={part.name} exercise={part.exercises} />
  ));

  const exerciseSum = parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <div>
      {partList}
      <p>
        <strong>total of {exerciseSum} exercises</strong>
      </p>
    </div>
  );
};

export default Content;
