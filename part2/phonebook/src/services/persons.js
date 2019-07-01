import axios from "axios";

const baseURL = `http://localhost:3001/persons`;

const getAll = () => {
  return axios.get(baseURL).then(response => response.data);
};

const create = newPerson => {
  return axios.post(baseURL, newPerson).then(response => response.data);
};

const update = (id, newPerson) => {
  return axios
    .put(`${baseURL}/${id}`, newPerson)
    .then(response => response.data);
};

const deletePerson = id => {
  return axios.delete(`${baseURL}/${id}`).then(response => response.status);
};

export default { getAll, create, update, deletePerson };
