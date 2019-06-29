import React from "react";

import CountryView from "./CountryView";

const CountryList = ({ selectedCountries }) => {
  const renderCountries = () => {
    switch (selectedCountries.length) {
      case 0: {
        return <div>No Results</div>;
      }
      case 1: {
        const country = selectedCountries[0];
        return (
          <div>
            <CountryView
              name={country.name}
              capital={country.capital}
              population={country.population}
              languages={country.languages}
              flag={country.flag}
            />
          </div>
        );
      }
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10: {
        const countryList = selectedCountries.map(country => (
          <div key={country.numericCode}>{country.name}</div>
        ));
        return <div>{countryList}</div>;
      }
      default: {
        return <div>Too many matches, specify another filter</div>;
      }
    }
  };

  return <div>{renderCountries()}</div>;
};

export default CountryList;
