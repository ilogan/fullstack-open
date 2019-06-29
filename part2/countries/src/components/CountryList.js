import React from "react";

const CountryList = ({ selectedCountries, handleClick }) => {
  const countryList = selectedCountries.map(country => (
    <div key={country.numericCode}>
      {country.name} <button onClick={() => handleClick(country)}>Show</button>
    </div>
  ));

  return <div>{countryList}</div>;
};
export default CountryList;
