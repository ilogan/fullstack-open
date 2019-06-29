import React, { useState, useEffect } from "react";
import axios from "axios";

import CountryForm from "./components/CountryForm";
import CountryContainer from "./components/CountryContainer";

const App = () => {
  const [countriesAPI, setCountriesAPI] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then(response => {
      console.log(response.data, "use effect");
      setCountriesAPI(response.data);
    });
  }, []);

  const handleChange = event => {
    const eventFilter = event.target.value;
    setFilter(eventFilter);
    setSelectedCountries(
      countriesAPI.filter(country =>
        country.name.toLowerCase().includes(eventFilter.toLowerCase())
      )
    );
  };

  const handleClick = country => {
    setSelectedCountries([country]);
  };

  return (
    <div>
      <CountryForm value={filter} handleChange={handleChange} />
      <CountryContainer
        selectedCountries={selectedCountries}
        handleClick={handleClick}
      />
    </div>
  );
};

export default App;
