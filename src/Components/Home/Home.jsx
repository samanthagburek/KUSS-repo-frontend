import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

import './Home.css';

const TEXT_READ_ENDPOINT = `${BACKEND_URL}/text`;


const Home = () => {
    const [aboutText, setAboutText] = useState('');
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

 return (
    <div className="journal-title">
        <h1>The KUSS Journal</h1>

        <section>
            <div className="about-container">
            <p> {aboutText}
            </p>
            </div>

            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </section>
    </div>
    );
};

export default Home;
