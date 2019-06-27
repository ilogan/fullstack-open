import React from "react";
import ReactDOM from "react-dom";

const Header = ({ courseName }) => {
  return <h1>{courseName}</h1>;
};
const Content = ({ parts }) => {
  return (
    <div>
      <Part name={parts[0].name} num={parts[0].exercises} />
      <Part name={parts[1].name} num={parts[1].exercises} />
      <Part name={parts[2].name} num={parts[2].exercises} />
    </div>
  );
};

const Part = ({ name, num }) => {
  return (
    <p>
      {name} {num}
    </p>
  );
};

const Total = ({ parts }) => {
  return (
    <div>
      <p>
        Number of exercises{" "}
        {parts[0].exercises + parts[1].exercises + parts[2].exercises}
      </p>
    </div>
  );
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3
      }
    ]
  };

  return (
    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
