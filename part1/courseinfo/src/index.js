import React from "react";
import ReactDOM from "react-dom";

const Header = ({ course }) => {
  return <h1>{course}</h1>;
};
const Content = ({ p1, p2, p3 }) => {
  return (
    <div>
      <Part name={p1.name} num={p1.exercises} />
      <Part name={p2.name} num={p2.exercises} />
      <Part name={p3.name} num={p3.exercises} />
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

const Total = ({ total }) => {
  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  );
};

const App = () => {
  const course = "Half Stack application development";
  const part1 = {
    name: "Fundamentals of React",
    exercises: 10
  };
  const part2 = {
    name: "Using props to pass data",
    exercises: 7
  };
  const part3 = {
    name: "State of a component",
    exercises: 14
  };

  return (
    <div>
      <Header course={course} />
      <Content p1={part1} p2={part2} p3={part3} />
      <Total total={part1.exercises + part2.exercises + part3.exercises} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
