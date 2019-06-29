import React, { useState, useEffect } from "react";
import axios from "axios";

import CountryForm from "./components/CountryForm";
import CountryList from "./components/CountryList";

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

  return (
    <div>
      <CountryForm value={filter} handleChange={handleChange} />
      <CountryList selectedCountries={selectedCountries} />
    </div>
  );
};

export default App;
