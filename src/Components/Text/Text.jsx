import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../../constants';
import './Text.css';

const TEXT_READ_ENDPOINT = `${BACKEND_URL}/text`;
const TEXT_CREATE_ENDPOINT = `${BACKEND_URL}/text`;
const TEXT_UPDATE_ENDPOINT = `${BACKEND_URL}/text`;

function AddTextForm({ visible, cancel, fetchText, setError }) {
    const [key, setKey] = useState('');
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [addMsg, setAddMsg] = useState('');
    const [errors, setErrors] = useState([]);

    const changeKey = (event) => { setKey(event.target.value); };
    const changeTitle = (event) => { setTitle(event.target.value); };
    const changeText = (event) => { setText(event.target.value); };

    const validateForm = () => {
        const newErrors = [];
        if (!key.trim()) newErrors.push('Key is required.');
        if (!title.trim()) newErrors.push('Title is required.');
        if (!text.trim()) newErrors.push('Text is required.');
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    useEffect(() => {
        if (errors.length > 0) {
        const timer = setTimeout(() => setErrors([]), 2000);
        return () => clearTimeout(timer);
        }
    }, [errors]);

    const addText = (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        const newText = {
            key: key,
            title: title,
            text: text,
        }
        axios.put(TEXT_CREATE_ENDPOINT, newText)
            .then(() => {
            setAddMsg(`${title} has been added successfully!`);
            setKey('');
            setTitle('');
            setText('');

            setTimeout(() => {
                setAddMsg('');
                cancel();
                fetchText();
            }, 2000);
            })
            .catch((error) => setError(`Error adding text: ${error}`));
        };

    if (!visible) return null;

    return (
       <div>
        {addMsg && <div className="popup-message">Text Added!</div>}
        <form className="text-container">
            <label>Key</label>
            <input type="text" value={key} onChange={changeKey} required />

            <label>Title</label>
            <input type="text" value={title} onChange={changeTitle} required />

            <label>Text</label>
            <textarea value={text} onChange={changeText} required />
            
            {errors.length > 0 && (
            <div className="error-message">
                <ul>{errors.map((err, index) => <li key={index}>{err}</li>)}</ul>
            </div>
            )}

            <button type="button" onClick={cancel}>Cancel</button>
            <button type="submit" onClick={addText}>Submit</button>
        </form>
    </div>
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

function UpdateTextForm({ visible, textItem, cancel, fetchText, setError }) {
    const [title, setTitle] = useState(textItem.title);
    const [text, setText] = useState(textItem.text);
    const [updateMsg, setUpdateMsg] = useState('');

    useEffect(() => {
        setTitle(textItem.title);
        setText(textItem.text);
        }, [textItem]);

    const changeTitle = (event) => { setTitle(event.target.value); };
    const changeText = (event) => { setText(event.target.value); };

    const updateText = (event) => {
        event.preventDefault();

        const updatedText = { 
            key: textItem.key, 
            title: title, 
            text: text 
        };

        axios.patch(TEXT_UPDATE_ENDPOINT, updatedText)
        .then(() => {
          setUpdateMsg(`"${title}" updated successfully!`);
          setTimeout(() => {
            setUpdateMsg('');
            cancel();
            fetchText();
            }, 2000);
        })
        .catch((error) => setError(`Error updating text: ${error}`));
      };

  if (!visible) return null;

  return (
    <div>
      {updateMsg && <div className="update-popup">{updateMsg}</div>}
      <form className="text-container">
        <label>Title</label>
        <input type="text" value={title} onChange={changeTitle} required />

        <label>Text</label>
        <textarea value={text} onChange={changeText} required />

        <button type="button" onClick={cancel}>Cancel</button>
        <button type="submit" onClick={updateText}>Update</button>
      </form>
    </div>
  );
}


UpdateTextForm.propTypes = {
  visible: propTypes.bool.isRequired,
  textItem: propTypes.shape({
      key: propTypes.string.isRequired,
      title: propTypes.string.isRequired,
      text: propTypes.string.isRequired,}).isRequired,
  cancel: propTypes.func.isRequired,
  fetchText: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

function Text() {
    const [error, setError] = useState('');
    const [texts, setTexts] = useState([]);
    const [addingText, setAddingText] = useState(false);
    const [delMsg, setdelMsg] = useState('');
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        if (error) {
        const timer = setTimeout(() => setError(''), 5000);
        return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (delMsg) {
        const timer = setTimeout(() => setdelMsg(''), 3000);
        return () => clearTimeout(timer);
        }
    }, [delMsg])

    const fetchText = () => {
        axios.get(TEXT_READ_ENDPOINT)
        .then(({ data }) => setTexts(Object.values(data)))
        .catch((error) => setError(`There was a problem retrieving texts. ${error.message}`));
    };

    const deleteText= (key,title) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${title}?`);
        if (!confirmDelete) return; 

        const deltext = { data: {key}}
   
        axios.delete(TEXT_READ_ENDPOINT,deltext)
        .then(() => {
            setTexts(texts.filter(t => t.key !== key));
            setdelMsg(`${title} deleted`);
            setTimeout(() => {
            setdelMsg('');
            fetchText();
        }, 2000);
        })
        .catch(error => console.error("Error deleting text:", error));
    };
    useEffect(fetchText, []);

    return (
        <div className="wrapper">
      <header>
        <h1>View All Texts</h1>
        <button type="button" onClick={() => setAddingText(true)}>Add a Text</button>
      </header>

      {delMsg && <div className="delete-popup">{delMsg}</div>}
      {error && <div className="error-message">{error}</div>}

      <AddTextForm
        visible={addingText}
        cancel={() => setAddingText(false)}
        fetchText={fetchText}
        setError={setError}
      />

      {texts.map((text) => (
        <div key={text.key} className="text-container">
          <h2>Title: {text.title}</h2>
          <p>Text: {text.text}</p>
          <button onClick={() => setUpdating(text)}>Update</button>
          <button onClick={() => deleteText(text.key, text.title)}>Delete</button>

          {updating && updating.key === text.key && (
            <UpdateTextForm
              visible={updating !== null}
              textItem={updating}
              cancel={() => setUpdating(null)}
              fetchText={fetchText}
              setError={setError}
            />
          )}
        </div>
      ))}
    </div>
  );
}

Text.propTypes = {
    thetext: propTypes.shape({
        key: propTypes.string.isRequired,
        title: propTypes.string.isRequired,
        text: propTypes.string.isRequired,
    }).isRequired,
    fetchText: propTypes.func,
};

// function textObjectToArray(Data) {
//     const keys = Object.keys(Data);
//     const texts = keys.map((key) => Data[key]);
//     return texts;
// }

// function Text() {
//     const [error, setError] = useState('');
//     const [texts, setText] = useState([]);
//     const [addingText, setAddingText] = useState(false);

//     const fetchText = () => {
//         axios.get(TEXT_READ_ENDPOINT)
//             .then(
//                 ({ data }) => { setText(textObjectToArray(data)) }
//             )
//             .catch((error) => setError(`There was a problem retrieving the list of texts. ${error}`));
//     };

//     const showAddTextForm = () => { setAddingText(true); };
//     const hideAddTextForm = () => { setAddingText(false); };

//     useEffect(fetchText, []);

//     return (
//         <div className="wrapper">
//             <header>
//                 <h1>
//                     View All Texts
//                 </h1>
//                 <button type="button" onClick={showAddTextForm}>
//                     Add a Text
//                 </button>
//             </header>
//             <AddTextForm
//                 visible={addingText}
//                 cancel={hideAddTextForm}
//                 fetchText={fetchText}
//                 setError={setError}
//             />
//             {error && <ErrorMessage message={error} />}
//             {texts.map((text) => <TextItem key={text.key} thetext={text} fetchText={fetchText} />)}
//         </div>
//     );
// }

export default Text;