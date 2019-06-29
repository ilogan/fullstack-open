import React from "react";

const CountryForm = ({ value, handleChange }) => {
  return (
    <div>
      find countries <input value={value} onChange={handleChange} />
    </div>
  );
};

export default CountryForm;
