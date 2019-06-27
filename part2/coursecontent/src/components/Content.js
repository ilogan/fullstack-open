import React from "react";

import Part from "./Part";

const Content = ({ parts }) => {
  const partList = parts.map(part => (
    <Part id={part.id} name={part.name} exercise={part.exercises} />
  ));
  return <div>{partList}</div>;
};

export default Content;
