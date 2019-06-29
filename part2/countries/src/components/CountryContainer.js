import React from "react";

import CountryView from "./CountryView";
import CountryList from "./CountryList";

const CountryContainer = ({ selectedCountries, handleClick }) => {
  const renderContainer = () => {
    const len = selectedCountries.length;
    if (len === 0) {
      return <div>No Results</div>;
    } else if (len === 1) {
      const country = selectedCountries[0];
      return (
        <CountryView
          name={country.name}
          capital={country.capital}
          population={country.population}
          languages={country.languages}
          flag={country.flag}
        />
      );
    } else if (len < 10) {
      return (
        <CountryList
          selectedCountries={selectedCountries}
          handleClick={handleClick}
        />
      );
    } else {
      return <div>Too many matches, specify another filter</div>;
    }
  };

  return <div>{renderContainer()}</div>;
};

export default CountryContainer;
