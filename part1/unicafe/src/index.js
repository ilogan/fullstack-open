import React, { useState } from "react";
import ReactDOM from "react-dom";

const Statistics = ({ scores: { good, bad, neutral, all } }) => {
  let body = <p>No feedback given</p>;
  if (all !== 0) {
    body = (
      <>
        <div>good {good}</div>
        <div>neutral {neutral}</div>
        <div>bad {bad}</div>
        <div>all {all}</div>
        <div>average {(good * 1 + bad * -1) / all}</div>
        <div>postive {(good / all) * 100}%</div>
      </>
    );
  }

  return (
    <div>
      <h1>statistics</h1>
      {body}
    </div>
  );
};

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const scores = {
    good,
    bad,
    neutral,
    all: good + bad + neutral
  };

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>
      <Statistics scores={scores} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
