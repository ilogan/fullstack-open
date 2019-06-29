import React, { useState, useEffect } from "react";
import axios from "axios";

const CountryView = ({ name, capital, population, languages, flag }) => {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    axios
      .get(
        `http://api.apixu.com/v1/current.json?key=${
          process.env.REACT_APP_API_KEY
        }&q=${capital}`
      )
      .then(response => setWeather(response.data.current));
  }, [capital]);

  const renderLanguages = () => {
    return languages.map(language => (
      <li key={language.iso639_2}>{language.name}</li>
    ));
  };

  const weatherIcon = weather.condition ? weather.condition.icon : null;

  return (
    <div>
      <h1>{name}</h1>
      <div>capital {capital}</div>
      <div>population {population}</div>
      <h2>languages</h2>
      <ul>{renderLanguages()}</ul>
      <img src={flag} style={{ width: "300px" }} alt="Country flag" />
      <h2>Weather</h2>
      <p>
        <strong>temperature:</strong> {weather.temp_c} Celcius
      </p>
      <img src={weatherIcon} alt="Weather Icon" />
      <p>
        <strong>wind:</strong> {weather.wind_kph} kph direction{" "}
        {weather.wind_dir}
      </p>
    </div>
  );
};

export default CountryView;
