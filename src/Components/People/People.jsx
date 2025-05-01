import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import User from '../../User';

 
import { BACKEND_URL } from '../../constants';

import './People.css';
// import { use } from 'react';

const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;
//const PERSON_ENDPOINT = `${BACKEND_URL}/people/<email>/<user_id>`;
// const PEOPLE_CREATE_ENDPOINT = `${BACKEND_URL}/people`;
const PEOPLE_UPDATE_ENDPOINT = `${BACKEND_URL}/people`;
const ROLES_ENDPOINT = `${BACKEND_URL}/roles`


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

function UpdatePersonForm({
  visible,
  person,
  cancel,
  fetchPeople,
  setError,
}) {
  const [name, setName] = useState(person.name);
  const [affiliation, setAffiliation] = useState(person.affiliation);
  const [updateMsg, setUpdateMsg] = useState('');
  const [roles, setRoles] = useState(person.roles);
  const [roleOptions, setRoleOptions] = useState('');
  const changeRoles = (event) => {
    if(roles.includes(event.target.value)) {
      setRoles(
        roles.filter(a =>
          a !== event.target.value
        )
      );
    } else {
      setRoles([
        ...roles,
        event.target.value
      ]);
    }
  }

  useEffect(() => {
    setName(person.name);
    setAffiliation(person.affiliation);
  }, [person]);

  const changeName = (event) => { setName(event.target.value); };
  const changeAffiliation = (event) => {setAffiliation(event.target.value); };

  const updatePerson = (event) => {
    event.preventDefault();
    const updatedPerson = {
      name: name,
      email: person.email,
      roles: roles,
      affiliation: affiliation,
    }
    
    axios.patch(PEOPLE_UPDATE_ENDPOINT, updatedPerson)
    .then(() => {
        setUpdateMsg(`Information updated for ${person.email}`);
        setTimeout(() => {setUpdateMsg(''); cancel();}, 3000);
        fetchPeople();
      })
      .catch((error) => { setError(`There was a problem updating the person. ${error}`); });
       
  };

  const getRoles = () => {
    axios.get(ROLES_ENDPOINT)
      .then(({ data }) => {setRoleOptions(data)})
      .catch((error) => { setError(`There was a problem getting roles. ${error}`); });
  }
  useEffect(getRoles, []);

  if (!visible) return null;
  return (
    <div>
      {updateMsg && <div className="update-popup">{updateMsg}</div>}
      <form>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" value={name} onChange={changeName} />
        
        <label htmlFor="affiliation">Affiliation</label>
        <input type="text" id="affiliation" value={affiliation} onChange={changeAffiliation} />
        
        <label htmlFor="role">
        Roles
        </label>
        <div className="roles-container">
          {
            Object.keys(roleOptions).map((code)=>(
              <div key={code} className="role">  
                <input type="checkbox" id={code} value={code} onChange={changeRoles} defaultChecked={roles.includes(code)} />
                <p>{roleOptions[code]}</p>
              </div>
            ))
          }
        </div>

        <button type="button" onClick={cancel}>Cancel</button>
        <button type="submit" onClick={updatePerson}>Submit</button>
      </form>
    </div>
  );
}

UpdatePersonForm.propTypes = {
  visible: propTypes.bool.isRequired,
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    affiliation: propTypes.string.isRequired,
    roles: propTypes.array.isRequired,
  }).isRequired,
  cancel: propTypes.func.isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};


function Person({ person, fetchPeople, setError }) {
  const { name, email, affiliation, roles } = person;
  const [delMsg, setdelMsg] = useState('');
  const [updating, setUpdating] = useState(false);
  const [roleOptions, setRoleOptions] = useState('');
  
  const rolesByName = roles.map(role => roleOptions[role]);
  const rolesString = roles.length > 1 ? 
                      rolesByName.slice(0,-1).join(", ") + " and " + rolesByName[roles.length-1]
                      : rolesByName[0];

  const getRoles = () => {
    axios.get(ROLES_ENDPOINT)
      .then(({ data }) => {setRoleOptions(data)})
  }
  useEffect(getRoles, []);

   roles.join(', ');

  const deletePerson = () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmDelete) return; 
    //const delperson = { data: {email}}
    const curr_user = User.getEmail();
    var del_endpt = PEOPLE_READ_ENDPOINT + '/' + email + '/' + curr_user
   
    axios.delete(del_endpt)
      .then(() => {
        setdelMsg(`${name} deleted`);
        setTimeout(() => {
        setdelMsg('');
        fetchPeople();
      }, 2500);
      })
      .then(() => {
      fetchPeople();})
      .catch((error) => {
        setError(`Error deleting person: ${error.message}`);
        window.scrollTo({top: 0, behavior: 'smooth'});
      });
  }

  return (
  <div className="person-wrapper">
    {updating ? (
      <>
        <div className="person-container">
         
        <h2>{name}</h2> <br></br>
          <p>{rolesString} at {affiliation}</p>
          <br></br>
          <p> Contact: {email} </p>
          <br></br>
          <UpdatePersonForm
          visible={true}
          person={person}
          cancel={() => setUpdating(false)}
          fetchPeople={fetchPeople}
          setError={() => {}}
        />
        </div>
        
      </>
    ) : (
      <>
        <div className="person-container">
          <h2>{name}</h2> <br></br>
          <p>{rolesString} at {affiliation}</p>
          <br></br>
          <p>Contact: <a href={`mailto:${email}`}>{email}</a></p>
          <br></br>
          <div className="grid-container">
            <button onClick={() => setUpdating(true)}>Update</button>
            <button className="delete-button" onClick={deletePerson}>Delete</button>
          </div>
        </div>
        
        {delMsg && <div className="delete-popup">{delMsg}</div>}
      </>
    )}
  </div>
);
}

Person.propTypes = {
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    affiliation: propTypes.string.isRequired,
    roles: propTypes.string.isRequired,
  }).isRequired,
  fetchPeople: propTypes.func,
  setError: propTypes.func.isRequired,

};

function peopleObjectToArray(Data) {
  const keys = Object.keys(Data);
  const people = keys.map((key) => Data[key]);
  return people;
}

function People() {
  const [error, setError] = useState('');
  const [people, setPeople] = useState([]);
  // const [addingPerson, setAddingPerson] = useState(false);

  const fetchPeople = () => {
    axios.get(PEOPLE_READ_ENDPOINT)
      .then(
        ({ data }) => { setPeople(peopleObjectToArray(data)) }
        
    )
      .catch((error) => setError(`There was a problem retrieving the list of people. ${error}`));
  };

  // const showAddPersonForm = () => { setAddingPerson(true); };
  // const hideAddPersonForm = () => { setAddingPerson(false); };

  useEffect(fetchPeople, []);

  
  return (
      <div className="wrapper">
          <div className="person-container">
      <header>
        <h1>
          View All People
        </h1>
        </header>
          {error && <ErrorMessage message={error} />}
          {people.map((person) => <Person key={person.email} person={person} fetchPeople={fetchPeople} setError={setError} />)}
           </div>
      </div>
  );
}

export default People;
