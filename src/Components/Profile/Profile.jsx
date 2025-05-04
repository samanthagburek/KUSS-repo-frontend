import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import User from '../../User';

import { BACKEND_URL } from '../../constants';
import './Profile.css';  

const PEOPLE_UPDATE_ENDPOINT = `${BACKEND_URL}/people`;

function Profile() {
    const navigate = useNavigate();
    const [name, setName] = useState(User.getName());
    const [isEditing, setIsEditing] = useState(false);
    const [updateMsg, setUpdateMsg] = useState('');
    const [error, setError] = useState('');

    const email = User.getEmail();
    const roles = User.getRoles();
    const affiliation = User.getAffiliation();

    const handleUpdate = (event) => {
        event.preventDefault();

        const updatedPerson = {
            name: name,
            email: email,
            roles: roles,
            affiliation: affiliation, 
        };

        axios.patch(PEOPLE_UPDATE_ENDPOINT, updatedPerson)
            .then(() => {
                User.setName(name);
                setUpdateMsg('Name updated successfully!');
                setTimeout(() => setUpdateMsg(''), 2000);
                setIsEditing(false);
            })
            .catch((error) => {
                setError(`Failed to update name: ${error.message}`);
            });
    };

    const handleLogout = () => {
        User.clear();
        navigate('/login');
    };

    return (
    <div className="profile-container">
        <h2>Your Profile</h2>

        {error && <div className="error-message">{error}</div>}
        {updateMsg && <div className="update-popup">{updateMsg}</div>}

        {isEditing ? (
            <form onSubmit={handleUpdate}>
                <label htmlFor="name"><strong>Name:</strong></label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
        ) : (
            <>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Roles:</strong> {roles.join(', ')}</p>
                <p><strong>Affiliation:</strong> {affiliation}</p>

                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={handleLogout} className="logout-button">Log Out</button>
           
            </>
        )}
    </div>
);
}

export default Profile;