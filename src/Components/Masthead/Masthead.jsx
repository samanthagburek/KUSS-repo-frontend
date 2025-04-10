import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
//import { Link } from 'react-router-dom';
 
import { BACKEND_URL } from '../../constants';

const MASTHEAD_ENDPOINT = `${BACKEND_URL}/people/masthead`;

function Person({person}) {
    const {role, people} = person;
    
    return (
        <div>
            <h2>{role}</h2>
            <div>
                {people.length > 0 ? (
                    people.map((people, index) => (
                        <div key={index} className="masthead-person">
                            {people.name}{people.affiliation && `, ${people.affiliation}`}
                        </div>
                    ))
                ) : (
                    <div className="masthead-person">No {role} currently</div>
                )}
            </div>
        </div>
    );
}

Person.propTypes = {
    person: propTypes.shape({
        role: propTypes.string.isRequired,
        people: propTypes.arrayOf(propTypes.shape({
            name: propTypes.string,
            affiliation: propTypes.string,
        })).isRequired,
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

function peopleObjectToArray(data) {
    return Object.entries(data).map(([role, people]) => ({
        role,
        people,
    }));
}

function Masthead() {
    const [error, setError] = useState('');
    const [masthead, setMasthead] = useState([]);
  
    const fetchMasthead = () => {
        axios.get(MASTHEAD_ENDPOINT)
            .then(({ data }) => { 
                setMasthead(peopleObjectToArray(data)); 
            })
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
            {masthead.map((person) => (
                <Person 
                    key={person.role} 
                    person={person} 
                    fetchMasthead={fetchMasthead} 
                />
            ))}
        </div>
    );
}
  
export default Masthead;