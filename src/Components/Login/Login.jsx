import React, { useEffect,useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Login.css';

const PEOPLE_CREATE_ENDPOINT = `${BACKEND_URL}/people`;

function AddPersonForm({
    cancel,
    setError,
}) {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [addMsg, setAddsMsg] = useState('');

    const changePassword = (event) => { setPassword(event.target.value); };
    const changeEmail = (event) => { setEmail(event.target.value); };

    const addPerson = (event) => {
        event.preventDefault();
        const newPerson = {
            email: email,
            password: password,
        }
        axios.put(PEOPLE_CREATE_ENDPOINT, newPerson)
            .then(() => {
                setAddsMsg(`${name} has been added successfully!`);
                setTimeout(() => {
                    setAddsMsg('');
                    cancel();
                }, 3000);
            })
            .catch((error) => {
                setError(`There was a problem adding the person. ${error}`);
            });
    };

    return (
        <div>
            {addMsg && <div className="add-popup">{addMsg}</div>}
            <form>
                <label htmlFor="email">
                    Email
                </label>
                <input required type="text" id="email" onChange={changeEmail} />
                <label htmlFor="password">
                    Password
                </label>
                <input required type="text" id="password" onChange={changePassword} />

                <button type="button" onClick={addPerson}>Log In</button>
            </form>
        </div>
    );
}

AddPersonForm.propTypes = {
    cancel: propTypes.func.isRequired,
    setError: propTypes.func.isRequired,
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

function Submission() {
    const [error, setError] = useState('');

    useEffect(() => {
        if (error) {
        const timer = setTimeout(() => setError(''), 10000);
        return () => clearTimeout(timer);
        }
    }, [error])

    return (
        <>
    <div className="subguide-container">
    <h2 className="guidelines-title">Log In</h2>

</div>
    {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    <div className="wrapper">
        
        <AddPersonForm
            setError={setError}
        />
    </div>
    </>
    );
}




export default Submission;