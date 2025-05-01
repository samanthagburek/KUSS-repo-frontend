import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';
import User from '../../User';

import './Home.css';

const TEXT_READ_ENDPOINT = `${BACKEND_URL}/text`;
const TEXT_UPDATE_ENDPOINT = `${BACKEND_URL}/text`;

const Home = () => {
    const [aboutText, setAboutText] = useState('');
    const [aboutTitle, setAboutTitle] =  useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [username, setUsername] = useState('');
    const [currUserEmail, setUserEmail] = useState('');
    const [currUserRoles, setUserRoles] = useState([]);

 useEffect(() => {
        setUsername(User.getName());
        setUserRoles(User.getRoles());
        setUserEmail(User.getEmail());
        axios.get(TEXT_READ_ENDPOINT)
            .then(({ data }) => {
                const aboutUsEntry = Object.values(data).find(text => text.key === "about_us");
                if (aboutUsEntry) {
                    setAboutText(aboutUsEntry.text);
                    setAboutTitle(aboutUsEntry.title);
                }
            })
            .catch(error => setError(`Error fetching about us data: ${error}`));
    }, []);

const handleChange = (event) => {
    setAboutText(event.target.value);
    };

const updateAboutUs = () => {
    const updatedText = {
        key: "about_us",
        title: aboutTitle,
        text: aboutText,
    };
    var update_endpt = TEXT_UPDATE_ENDPOINT + '/' + currUserEmail;
    axios.patch(update_endpt, updatedText)
        .then(() => {
        setIsEditing(false);
        setSuccessMessage(`${aboutTitle} updated!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch(error => setError(`Error updating about us: ${error}`));
     };


 return (
    <div className="journal-title">
        <h1>The KUSS Journal</h1>

        <section>
            {isEditing ? (
                <div>
                <textarea 
                    value={aboutText} 
                    onChange={handleChange} 
                    rows={4} 
                    style={{ width: '80%', padding: '10px', fontSize: '16px', lineHeight: '1.6' }}
                />
                {currUserRoles.some(item => ["ME", "CE", "ED"].includes(item)) && (
                    <button onClick={isEditing ? updateAboutUs : () => setIsEditing(true)}>
                        {isEditing ? 'Save' : 'Edit'}
                    </button>)}
                </div>
            ) : (
            <div className="about-container">
            <p>{username != "" ? "Hello, " + username : "!"}</p>
            <p> {aboutText}</p>
            {currUserRoles.some(item => ["ME", "CE", "ED"].includes(item)) && (
            <button onClick={isEditing ? updateAboutUs : () => setIsEditing(true)}>
                {isEditing ? 'Save' : 'Edit'}
            </button>)}
            </div>
            )}
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </section>

        {successMessage && (
      <div className="pop-up">
        {successMessage}
      </div>
    )}
    </div>
    

    );
};

export default Home;
