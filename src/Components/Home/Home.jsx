import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

import './Home.css';

const TEXT_READ_ENDPOINT = `${BACKEND_URL}/text`;
const TEXT_UPDATE_ENDPOINT = `${BACKEND_URL}/text`;


const Home = () => {
    const [aboutText, setAboutText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

 useEffect(() => {
        axios.get(TEXT_READ_ENDPOINT)
            .then(({ data }) => {
                const aboutUsEntry = Object.values(data).find(text => text.key === "about_us");
                if (aboutUsEntry) {
                    setAboutText(aboutUsEntry.text);
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
            title: "About Us",
            text: aboutText,
        };

        axios.patch(TEXT_UPDATE_ENDPOINT, updatedText)
            .then(() => {
                setIsEditing(false);
            })
            .catch(error => setError(`Error updating about us: ${error}`));
    };

 return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>The KUSS Journal</h1>

            <section>
    
                {isEditing ? (
                    <textarea 
                        value={aboutText} 
                        onChange={handleChange} 
                        rows={4} 
                        style={{ width: '80%', padding: '10px', fontSize: '16px', lineHeight: '1.6' }}
                    />
                ) : (
                  <div className="about-container">
                    <p style={{ 
                        fontSize: '21px', 
                        fontWeight: '400', 
                        lineHeight: '1.6', 
                        whiteSpace: 'pre-line'
                    }}>
                   
                        {aboutText}
                    </p>
                  </div>
                )}
                <button 
                    onClick={isEditing ? updateAboutUs : () => setIsEditing(true)} 
                    style={{ marginTop: '10px', padding: '5px 5px', fontSize: '18px', cursor: 'pointer' }}
                >
                    {isEditing ? 'Save' : 'Edit'}
                </button>

                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            </section>
        </div>
    );
};

export default Home;
