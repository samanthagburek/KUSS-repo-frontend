import React, { useEffect,useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Submission.css';
const MANUSCRIPTS_ENDPOINT = `${BACKEND_URL}/manuscripts`;
const TEXT_READ_ENDPOINT = `${BACKEND_URL}/text`;


function AddManuscript({ visible, cancel, fetchManus, setError, hasReadGuidelines, setHasReadGuidelines }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [author_email, setAuthorEmail] = useState('');
    const [text, setText] = useState('');
    const [abstract, setAbstract] = useState('');
    // const [editor_email, setEditorEmail] = useState('');
    const [addMsg, setAddMsg] = useState(false);
    const [errors, setErrors] = useState([]);


    const changeTitle = (event) => setTitle(event.target.value);
    const changeAuthor = (event) => setAuthor(event.target.value);
    const changeAuthorEmail = (event) => setAuthorEmail(event.target.value);
    const changeText = (event) => setText(event.target.value);
    const changeAbstract = (event) => setAbstract(event.target.value);
    // const changeEditorEmail = (event) => setEditorEmail(event.target.value);

    const validateForm = () => {
    const newErrors = [];
    if (!title.trim()) newErrors.push('Title is required.');
    if (!author.trim()) newErrors.push('Author is required.');
    if (!author_email.trim()) newErrors.push('Author Email is required.');
    if (!text.trim()) newErrors.push('Text is required.');
    if (!abstract.trim()) newErrors.push('Abstract is required.');
    // if (!editor_email.trim()) newErrors.push('Editor Email is required.');
    if (!hasReadGuidelines) newErrors.push('You must agree to the submission guidelines before submitting.');

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
        // editor_email: editor_email,
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
        // setEditorEmail('');
        setTimeout(() => {
        setAddMsg('');
        setHasReadGuidelines(false); 
        cancel();
        fetchManus();
      },2000); })
      .catch((error) => setError(`Error submitting manuscript: ${error.message}`));
  };

if (!visible) return null;
return (
    <div>
    {addMsg && <div className="popup-message">Manuscript Submitted!</div>}
    
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

      {/* <label>Editor Email</label>
      <input type="email" value={editor_email} onChange={changeEditorEmail} required /> */}
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
    hasReadGuidelines: propTypes.bool.isRequired,
    setHasReadGuidelines: propTypes.func.isRequired,
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
    const [addingManus, setAddingManus] = useState(false);
    const [subguideText, setsubguideText] = useState('');
    const [hasReadGuidelines, setHasReadGuidelines] = useState(false);


    useEffect(() => {
        if (error) {
        const timer = setTimeout(() => setError(''), 10000);
        return () => clearTimeout(timer);
        }
    }, [error])

     useEffect(() => {
        axios.get(TEXT_READ_ENDPOINT)
            .then(({ data }) => {
                const subguide = Object.values(data).find(text => text.key === "submission_guidelines");
                if (subguide) {
                    setsubguideText(subguide.text);
                }
            })
            .catch(error => setError(`Error fetching submission guidelines: ${error}`));
    }, []);


    const fetchManus = () => {
        axios.get(MANUSCRIPTS_ENDPOINT)
        .then(() => {})
        .catch((error) => setError(`There was a problem retrieving manuscripts. ${error.message}`));
    };


    useEffect(fetchManus, []);

    return (
        <>
    <div className="subguide-container">
    <h2 className="guidelines-title">Submission Guidelines</h2>
    <p> {subguideText}</p>
    </div>
    {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

    <div className="checkbox-wrapper">
        <input
            type="checkbox"
            id="guidelinesCheck"
            checked={hasReadGuidelines}
            onChange={() => setHasReadGuidelines(!hasReadGuidelines)}
        />
        <label htmlFor="guidelinesCheck">I have read and agree to the submission guidelines</label>
        </div>
    <div className="wrapper">

        {!addingManus ? (
            <button onClick={() => setAddingManus(true)}>Submit a Manuscript</button>
        ) : (
            <h2 className="submit-manuscript-heading">Submit a Manuscript</h2>
        )}

        
        <AddManuscript
            visible={addingManus}
            cancel={() => setAddingManus(false)}
            fetchManus={fetchManus}
            setError={setError}
            hasReadGuidelines={hasReadGuidelines}
            setHasReadGuidelines={setHasReadGuidelines}
        />
    </div>
    </>
    );
}




export default Submission;