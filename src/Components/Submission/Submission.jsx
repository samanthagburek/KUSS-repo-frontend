import React, { useEffect,useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Submission.css';
const MANUSCRIPTS_ENDPOINT = `${BACKEND_URL}/manuscripts`;


function AddManuscript({ visible, cancel, fetchManus, setError }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [author_email, setAuthorEmail] = useState('');
  const [text, setText] = useState('');
  const [abstract, setAbstract] = useState('');
  const [editor_email, setEditorEmail] = useState('');
  const [addMsg, setAddMsg] = useState(false);
  const [errors, setErrors] = useState([]);


  const changeTitle = (event) => setTitle(event.target.value);
  const changeAuthor = (event) => setAuthor(event.target.value);
  const changeAuthorEmail = (event) => setAuthorEmail(event.target.value);
  const changeText = (event) => setText(event.target.value);
  const changeAbstract = (event) => setAbstract(event.target.value);
  const changeEditorEmail = (event) => setEditorEmail(event.target.value);

  const validateForm = () => {
  const newErrors = [];
  if (!title.trim()) newErrors.push('Title is required.');
  if (!author.trim()) newErrors.push('Author is required.');
  if (!author_email.trim()) newErrors.push('Author Email is required.');
  if (!text.trim()) newErrors.push('Text is required.');
  if (!abstract.trim()) newErrors.push('Abstract is required.');
  if (!editor_email.trim()) newErrors.push('Editor Email is required.');

  setErrors(newErrors);
  return newErrors.length === 0;
};

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 2000); 
      return () => clearTimeout(timer);
    }
  }, [errors])

  const addManus = (event) => {
    event.preventDefault();
     if (!validateForm()) {
      return;
    }
    const newManuscript = { 
        title: title,
        author: author, 
        author_email: author_email,
        text: text,
        abstract: abstract,
        editor_email: editor_email,
        referees: {}
    };

    axios.put(MANUSCRIPTS_ENDPOINT, newManuscript)
      .then(() => {
        setAddMsg(true);
        setTitle('');
        setAuthor('');
        setAuthorEmail('');
        setText('');
        setAbstract('');
        setEditorEmail('');
        setTimeout(() => {
        setAddMsg('');
        cancel();
        fetchManus();
      },2000); })
      .catch((error) => setError(`Error submitting manuscript: ${error.message}`));
  };
if (!visible) return null;
return (
    <div>
    {addMsg && <div className="popup-message">Manuscript Added!</div>}
    
    <form className="submission-container">
      <label>Title</label>
      <input type="text" value={title} onChange={changeTitle} required />

      <label>Author</label>
      <input type="text" value={author} onChange={changeAuthor} required />

      <label>Author Email</label>
      <input type="email" value={author_email} onChange={changeAuthorEmail} required />

      <label>Text</label>
      <textarea value={text} onChange={changeText} required  />

      <label>Abstract</label>
      <textarea value={abstract} onChange={changeAbstract} required />

      <label>Editor Email</label>
      <input type="email" value={editor_email} onChange={changeEditorEmail} required />
       {errors.length > 0 && (
        <div className="error-message">
          <ul>
            {errors.map((err, index) => <li key={index}>{err}</li>)}
          </ul>
        </div>
      )}

      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={addManus}>Submit</button>
    </form>
   </div>
  );
}

AddManuscript.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchManus: propTypes.func.isRequired,
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
function UpdateManuscriptForm({ visible, manuscript, cancel, fetchManus, setError }) {
  const [title, setTitle] = useState(manuscript.title);
  const [author, setAuthor] = useState(manuscript.author);
  const [author_email, setAuthorEmail] = useState(manuscript.author_email);
  const [text, setText] = useState(manuscript.text);
  const [abstract, setAbstract] = useState(manuscript.abstract);
  const [editor_email, setEditorEmail] = useState(manuscript.editor_email);
  const [referee, setReferee] = useState("");
  const [updateMessage, setUpdateMessage] = useState('');

useEffect(() => {
   if (manuscript) {
    setTitle(manuscript.title);
    setAuthor(manuscript.author);
    setAuthorEmail(manuscript.author_email);
    setText(manuscript.text);
    setAbstract(manuscript.abstract);
    setEditorEmail(manuscript.editor_email);
    setReferee('');
    }
  }, [manuscript]);


const changeTitle = (event) => { setTitle(event.target.value); };
const changeAuthor = (event) => { setAuthor(event.target.value); };
const changeAuthorEmail = (event) => { setAuthorEmail(event.target.value); };
const changeText = (event) => { setText(event.target.value); };
const changeAbstract = (event) => { setAbstract(event.target.value); };
const changeEditorEmail = (event) => { setEditorEmail(event.target.value); };
const changereferee = (event) => { setReferee(event.target.value); };

  const updateManuscript = (event) => {
    event.preventDefault();

    const updatedManuscript = {
      title: title,
      author: author,
      author_email: author_email,
      text: text, 
      abstract: abstract,
      editor_email: editor_email,
      referee: referee
    };
    
    axios.patch(MANUSCRIPTS_ENDPOINT, updatedManuscript)
      .then(() => {
        setUpdateMessage(`"${title}" updated successfully!`);
        setTimeout(() => {
          setUpdateMessage('');
          cancel();
          fetchManus();
        }, 2000);
      })
      .catch((error) => setError(`Error updating manuscript: ${error.message}`));
  };
if (!visible) return null;
 return (
      <div>
      {updateMessage && <div className="update-popup">{updateMessage}</div>}
      <form className="submission-container">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" value={title} onChange={changeTitle} />

        <label htmlFor="author">Author</label>
        <input type="text" id="author" value={author} onChange={changeAuthor} />

        <label htmlFor="author_email">Author Email</label>
        <input type="email" id="author_email" value={author_email} onChange={changeAuthorEmail} />

        <label htmlFor="text">Text</label>
        <textarea id="text" value={text} onChange={changeText} />

        <label htmlFor="abstract">Abstract</label>
        <textarea id="abstract" value={abstract} onChange={changeAbstract}/>

        <label htmlFor="editor_email">Editor Email</label>
        <input type="email" id="editor_email" value={editor_email} onChange={changeEditorEmail} />
        <label htmlFor="referee">Referee</label>
        <input type="text" id="referee" value={referee} onChange={changereferee} />

        <button type="button" onClick={cancel}>Cancel</button>
        <button type="submit" onClick={updateManuscript}>Update</button>
      </form>
    </div>
 );
}
UpdateManuscriptForm.propTypes = {
  visible: propTypes.bool.isRequired,
  manuscript: propTypes.shape({
      title: propTypes.string.isRequired,
      author: propTypes.string.isRequired,
      author_email: propTypes.string.isRequired,
      text: propTypes.string.isRequired,
      abstract: propTypes.string.isRequired,
      editor_email: propTypes.string.isRequired,}).isRequired,
  cancel: propTypes.func.isRequired,
  fetchManus: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};
function Submission() {
  const [error, setError] = useState('');
  const [manuscripts, setManus] = useState([]);
  const [addingManus, setAddingManus] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [updatingManus, setUpdatingManus] = useState(null);


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error])

  useEffect(() => {
    if (deleteMessage) {
      const timer = setTimeout(() => setDeleteMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [deleteMessage])

const fetchManus = () => {
    axios.get(MANUSCRIPTS_ENDPOINT)
      .then(({ data }) => setManus(Object.values(data)))
      .catch((error) => setError(`There was a problem retrieving manuscripts. ${error.message}`));
  };

const deleteManus = (title) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmDelete) return;

    axios.delete(MANUSCRIPTS_ENDPOINT, { data: { title } })
      .then(() => {
        setManus(manuscripts.filter(m => m.title !== title));
        setDeleteMessage(`Manuscript "${title}" deleted successfully.`);
      })
      .catch((error) => setError(`Error deleting manuscript: ${error.message}`));
  };

useEffect(fetchManus, []);

return (
    <div className="wrapper">
      <header>
        <h1>Dashboard</h1>
        <button type="button" onClick={() => setAddingManus(true)}>Add a Manuscript</button>
      </header>
       {deleteMessage && (
        <div className="delete-popup">
          {deleteMessage}
        </div>
      )}
      
      <AddManuscript
        visible={addingManus}
        cancel={() => setAddingManus(false)}
        fetchManus={fetchManus}
        setError={setError}
      />

      
     {error && <ErrorMessage message={error} />}
      {manuscripts.map((manuscript) => (
        <div key={manuscript.title} className="manuscript-container">
          <h2>Title: {manuscript.title}</h2>
          <p>Author: {manuscript.author}</p>
          <p>Author Email: {manuscript.author_email}</p>
          <p>Text: {manuscript.text}</p>
          <p>Abstract: {manuscript.abstract}</p>
          <p>Editor Email: {manuscript.editor_email}</p>
          <p>Referees: {manuscript.referee}</p>
          <button onClick={() => setUpdatingManus(manuscript)}>Update</button>

          <button onClick={() => deleteManus(manuscript.title)}>Delete</button>
          {updatingManus && updatingManus.title === manuscript.title && <UpdateManuscriptForm
            visible={updatingManus !== null}
            manuscript={updatingManus || {}}
            cancel={() => setUpdatingManus(null)}
            fetchManus={fetchManus}
            setError={setError}
          />}
        </div>
      ))}
    </div>
  );
}


export default Submission;