import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import User from '../../User';
import './Login.css';

const PEOPLE_ENDPOINT = `${BACKEND_URL}/login`;

function LoginForm({
    setError,
}) {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [addMsg, setAddsMsg] = useState('');

    const changePassword = (event) => { setPassword(event.target.value); };
    const changeEmail = (event) => { setEmail(event.target.value); };
    const navigate = useNavigate();

    const tryLogin = (event) => {
        event.preventDefault();
        var endpoint = PEOPLE_ENDPOINT + "/" + email + "/" + password
        axios.get(endpoint)
        
            .then(({data}) => {
                setAddsMsg(`${data["email"]} log in success!`);
                User.setName(data["email"]);
                setTimeout(() => {
                    setAddsMsg('');
                    navigate('/');
                }, 3000);
            })
            .catch(() => {
                setError(`User not found.`);
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

                <button type="button" onClick={tryLogin}>Log In</button>
            </form>
        </div>
    );
}

LoginForm.propTypes = {
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
        
        <LoginForm
            setError={setError}
        />
    </div>
    </>
    );
}




export default Submission;