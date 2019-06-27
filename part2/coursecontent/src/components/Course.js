import React from "react";

const Header = ({ courseName }) => {
  return <h2>{courseName}</h2>;
};

const Content = ({ parts }) => {
  const partList = parts.map(part => (
    <Part key={part.id} name={part.name} exercise={part.exercises} />
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

const Part = ({ name, exercise }) => {
  return (
    <p>
      {name} {exercise}
    </p>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
    </div>
  );
};

export default Course;
