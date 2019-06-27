import React, { useState } from "react";
import ReactDOM from "react-dom";

const Statistic = ({ text, value, isPercent }) => {
  let percent = null;
  if (isPercent) {
    percent = "%";
  }
  return (
    <tr>
      <td>{text}</td>
      <td>{value + percent}</td>
    </tr>
  );
};

const Statistics = ({ scores: { good, bad, neutral, all } }) => {
  let body = <p>No feedback given</p>;
  if (all !== 0) {
    body = (
      <table>
        <tbody>
          <Statistic text="good" value={good} />
          <Statistic text="neutral" value={neutral} />
          <Statistic text="bad" value={bad} />
          <Statistic text="all" value={all} />
          <Statistic text="average" value={(good * 1 + bad * -1) / all} />
          <Statistic text="positive" value={(good / all) * 100} isPercent />
        </tbody>
      </table>
    );
  }

  return (
    <div>
      <h1>statistics</h1>
      {body}
    </div>
  );
};

const Button = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
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
      <Button text="good" onClick={() => setGood(good + 1)} />
      <Button text="neutral" onClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" onClick={() => setBad(bad + 1)} />
      <Statistics scores={scores} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
