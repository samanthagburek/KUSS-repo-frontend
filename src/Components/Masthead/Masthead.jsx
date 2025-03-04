import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
 
import { BACKEND_URL } from '../../constants';

const MASTHEAD_ENDPOINT = `${BACKEND_URL}/people/masthead`;

function Person({person}) {
    const {name, email} = person;

return (
    <div>
        <Link to={name}>
                <div className="person-container">
                  <h2>{name}</h2>
                  <p>
                    Email: {email}
                  </p>
                </div>
              </Link>
    </div>
);
}

Person.propTypes = {
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
  }).isRequired,
  fetchMasthead: propTypes.func,

};

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      {message}
    </div>
  );
}
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

function peopleObjectToArray(Data) {
    const keys = Object.keys(Data);
    const people = keys.map((key) => Data[key]);
    return people;
  }

  function Masthead() {
    const [error, setError] = useState('');
    const [masthead, setMasthead] = useState([]);
  
    const fetchMasthead = () => {
      axios.get(MASTHEAD_ENDPOINT)
        .then(
          ({ data }) => { setMasthead(peopleObjectToArray(data)) }
      )
        .catch((error) => setError(`There was a problem retrieving the list of people. ${error}`));
    };
  
    useEffect(fetchMasthead, []);
  
    return (
      <div className="wrapper">
        <header>
          <h1>
            Masthead
          </h1>
        </header>
        {error && <ErrorMessage message={error} />}
        {masthead.map((person) => <Person key={person.email} person={person} fetchMasthead={fetchMasthead} />)}
      </div>
    );
  }
  
  export default Masthead;