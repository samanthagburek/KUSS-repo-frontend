import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { BACKEND_URL } from '../../constants';

import './Text.css';

const TEXT_READ_ENDPOINT = `${BACKEND_URL}/text`;
const TEXT_CREATE_ENDPOINT = `${BACKEND_URL}/text`;

function AddTextForm({
    visible,
    cancel,
    fetchText,
    setError,
}) {
    const [key, setKey] = useState('');
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    const changeKey = (event) => { setKey(event.target.value); };
    const changeTitle = (event) => { setTitle(event.target.value); };
    const changeText = (event) => { setText(event.target.value); };

    const addText = (event) => {
        event.preventDefault();
        const newText = {
            key: key,
            title: title,
            text: text,
        }
        axios.put(TEXT_CREATE_ENDPOINT, newText)
            .then(fetchText)
            .catch((error) => { setError(`There was a problem adding the text. ${error}`); });
    };

    if (!visible) return null;
    return (
        <form>
            <label htmlFor="key">
                Key
            </label>
            <input required type="text" id="key" value={key} onChange={changeKey} />
            <label htmlFor="title">
                Title
            </label>
            <input required type="text" id="title" onChange={changeTitle} />
            <label htmlFor="text">
                Text
            </label>
            <input required type="text" id="text" onChange={changeText} />
            <button type="button" onClick={cancel}>Cancel</button>
            <button type="submit" onClick={addText}>Submit</button>
        </form>
    );
}

AddTextForm.propTypes = {
    visible: propTypes.bool.isRequired,
    cancel: propTypes.func.isRequired,
    fetchText: propTypes.func.isRequired,
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

// Rename this component to TextItem
function TextItem({ thetext, fetchText }) {
    const { key, title, text } = thetext;

    //delete not working yet!
    //delete not working yet!
    const [delMsg, setdelMsg] = useState('');
    const deleteText= () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmDelete) return; 
    const deltext = { data: {key}}
   
    axios.delete(TEXT_READ_ENDPOINT,deltext)
      .then(() => {
        setdelMsg(`${title} deleted`);
        setTimeout(() => {
        setdelMsg('');
        fetchText();
      }, 2500);
      })
      .then(fetchText)
      .catch(error => console.error("Error deleting text:", error));
    }

    return (
        <div>
            <Link to={title}>
                <div className="text-container">
                    <h2>{title}</h2>
                    <p>
                        Text: {text}
                    </p>
                </div>
            </Link>
            <button onClick={deleteText}>Delete text</button>
            {delMsg && (
                <div className="delete-popup">
                {delMsg}
                </div>
            )}
        </div>
    );
}

TextItem.propTypes = {
    thetext: propTypes.shape({
        key: propTypes.string.isRequired,
        title: propTypes.string.isRequired,
        text: propTypes.string.isRequired,
    }).isRequired,
    fetchText: propTypes.func,
};

function textObjectToArray(Data) {
    const keys = Object.keys(Data);
    const texts = keys.map((key) => Data[key]);
    return texts;
}

function Text() {
    const [error, setError] = useState('');
    const [texts, setText] = useState([]);
    const [addingText, setAddingText] = useState(false);

    const fetchText = () => {
        axios.get(TEXT_READ_ENDPOINT)
            .then(
                ({ data }) => { setText(textObjectToArray(data)) }
            )
            .catch((error) => setError(`There was a problem retrieving the list of texts. ${error}`));
    };

    const showAddTextForm = () => { setAddingText(true); };
    const hideAddTextForm = () => { setAddingText(false); };

    useEffect(fetchText, []);

    return (
        <div className="wrapper">
            <header>
                <h1>
                    View All Texts
                </h1>
                <button type="button" onClick={showAddTextForm}>
                    Add a Text
                </button>
            </header>
            <AddTextForm
                visible={addingText}
                cancel={hideAddTextForm}
                fetchText={fetchText}
                setError={setError}
            />
            {error && <ErrorMessage message={error} />}
            {texts.map((text) => <TextItem key={text.key} thetext={text} fetchText={fetchText} />)}
        </div>
    );
}

export default Text;