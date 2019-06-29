import React from "react";

const CountryView = ({ name, capital, population, languages, flag }) => {
  const renderLanguages = () => {
    return languages.map(language => (
      <li key={language.iso639_2}>{language.name}</li>
    ));
  };

  return (
    <div>
      <h1>{name}</h1>
      <div>capital {capital}</div>
      <div>population {population}</div>
      <h2>languages</h2>
      <ul>{renderLanguages()}</ul>
      <img src={flag} style={{ width: "300px" }} alt="Country flag" />
    </div>
  );
};

export default CountryView;
