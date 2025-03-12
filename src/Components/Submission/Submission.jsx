import React, { useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Submission.css';
const MANUSCRIPTS_ENDPOINT = `${BACKEND_URL}/manuscripts`;

function AddManuscript({ cancel, fetchManus, setError }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [text, setText] = useState('');
  const [abstract, setAbstract] = useState('');
  const [editor_email, setEditorEmail] = useState('');


  const changeTitle = (event) => setTitle(event.target.value);
  const changeAuthor = (event) => setAuthor(event.target.value);
  const changeAuthorEmail = (event) => setAuthorEmail(event.target.value);
  const changeText = (event) => setText(event.target.value);
  const changeAbstract = (event) => setAbstract(event.target.value);
  
  const addManus = (event) => {
    event.preventDefault();
    const newManuscript = { 
        title: title,
        author: author, 
        author_email: authorEmail,
        text: text,
        abstract: abstract,
        editor_email: editor_email};

    axios.put(MANUSCRIPTS_ENDPOINT, newManuscript)
      .then(() => {
        fetchManus();
        cancel();
        setTitle('');
        setAuthor('');
        setAuthorEmail('');
        setText('');
        setAbstract('');
        setEditorEmail('');
      })
      .catch((error) => setError(`Error submitting manuscript: ${error.message}`));
  };

return (
    <form className="submission-container">
      <label>Title</label>
      <input type="text" value={title} onChange={changeTitle} required />

      <label>Author</label>
      <input type="text" value={author} onChange={changeAuthor} required />

      <label>Author Email</label>
      <input type="email" value={authorEmail} onChange={changeAuthorEmail} required />

      <label>Text</label>
      <textarea value={text} onChange={changeText} required />

      <label>Abstract</label>
      <textarea value={abstract} onChange={changeAbstract} required />

      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={addManus}>Submit</button>
    </form>
  );
}

AddManuscript.propTypes = {
  cancel: propTypes.func.isRequired,
  fetchManus: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

export default AddManuscript;