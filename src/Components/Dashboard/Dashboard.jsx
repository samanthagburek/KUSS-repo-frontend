import React, { useEffect,useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Dashboard.css';
const MANUSCRIPTS_ENDPOINT = `${BACKEND_URL}/manuscripts`;
const MANUSCRIPTS_ACTIONS_ENDPOINT = `${BACKEND_URL}/manuscripts/actions`;
const MANUSCRIPTS_RECEIVE_ACTION_ENDPOINT = `${BACKEND_URL}/manuscripts/receive_action`;

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
  const [updateMessage, setUpdateMessage] = useState('');

useEffect(() => {
   if (manuscript) {
    setTitle(manuscript.title);
    setAuthor(manuscript.author);
    setAuthorEmail(manuscript.author_email);
    setText(manuscript.text);
    setAbstract(manuscript.abstract);
    setEditorEmail(manuscript.editor_email);
    }
  }, [manuscript]);


const changeTitle = (event) => { setTitle(event.target.value); };
const changeAuthor = (event) => { setAuthor(event.target.value); };
const changeAuthorEmail = (event) => { setAuthorEmail(event.target.value); };
const changeText = (event) => { setText(event.target.value); };
const changeAbstract = (event) => { setAbstract(event.target.value); };
const changeEditorEmail = (event) => { setEditorEmail(event.target.value); };

  const updateManuscript = (event) => {
    event.preventDefault();

    const updatedManuscript = {
      _id : manuscript._id,
      title: title,
      author: author,
      author_email: author_email,
      text: text, 
      abstract: abstract,
      editor_email: editor_email,
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
      <form className="dashboard-container">
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

        
        <button type="button" onClick={cancel}>Cancel</button>
        <button type="submit" onClick={updateManuscript}>Update</button>
      </form>
    </div>
 );
}
UpdateManuscriptForm.propTypes = {
  visible: propTypes.bool.isRequired,
  manuscript: propTypes.shape({
      _id: propTypes.string.isRequired,
      title: propTypes.string.isRequired,
      author: propTypes.string.isRequired,
      author_email: propTypes.string.isRequired,
      text: propTypes.string.isRequired,
      abstract: propTypes.string.isRequired,
      state: propTypes.string.isRequired,
      editor_email: propTypes.string.isRequired,}).isRequired,
  cancel: propTypes.func.isRequired,
  fetchManus: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

function SendActionForm({ visible, manuscript, cancel, fetchManus, setError }) {
  const [title, setTitle] = useState(manuscript.title);
  const [updateMessage, setUpdateMessage] = useState('');

  const [action, SetAction] = useState('');
  const [actionOptions, setActionOptions] = useState('');

  const changeAction = (event) => { SetAction(actionOptions[event.target.value]); };

useEffect(() => {
   if (manuscript) {
    setTitle(manuscript.title);
    }
  }, [manuscript]);

  const getActions = () => {
    axios.get(MANUSCRIPTS_ACTIONS_ENDPOINT)
      .then(({ data }) => {setActionOptions(data)})
      .catch((error) => { setError(`There was a problem getting roles. ${error}`); });
  }
  useEffect(getActions, []);

  const updateManuscript = (event) => {
    event.preventDefault();

    const actionForm = {
      title: manuscript.title,
      curr_state: manuscript.state,
      action: action,
      referee: "placeholder" //this should change
    };
    
    axios.put(MANUSCRIPTS_RECEIVE_ACTION_ENDPOINT, actionForm)
      .then(() => {
        setUpdateMessage(`"${title}" updated successfully!`);
        setTimeout(() => {
          setUpdateMessage('');
          cancel();
          fetchManus();
        }, 2000);
      })
      .catch((error) => setError(`Error updating "${manuscript.title}""${manuscript.state}""${action}" manuscript: ${error.message}`));
  };
if (!visible) return null;
 return (
      <div>
      {updateMessage && <div className="update-popup">{updateMessage}</div>}
      <form className="dashboard-container">
      <p>Select an action to send</p>
        <select name='sendAction' onChange={changeAction}>
          {
            Object.keys(actionOptions).map((code)=>(
              <option key={code} value={code}>
                {actionOptions[code]}
              </option>
            ))
          }
        </select> <br></br><br></br>
        <button type="button" onClick={cancel}>Cancel</button>
        <button type="submit" onClick={updateManuscript}>Update</button>
      </form>
    </div>
 );
}
SendActionForm.propTypes = {
  visible: propTypes.bool.isRequired,
  manuscript: propTypes.shape({
      title: propTypes.string.isRequired,
      author: propTypes.string.isRequired,
      author_email: propTypes.string.isRequired,
      text: propTypes.string.isRequired,
      abstract: propTypes.string.isRequired,
      state: propTypes.string.isRequired,
      editor_email: propTypes.string.isRequired,}).isRequired,
  cancel: propTypes.func.isRequired,
  fetchManus: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

function Dashboard() {
  const [error, setError] = useState('');
  const [manuscripts, setManus] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [updatingManus, setUpdatingManus] = useState(null);
  const [sendingAction, setSendingAction] = useState(null);


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

const deleteManus = (_id, title) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmDelete) return;

    axios.delete(MANUSCRIPTS_ENDPOINT, { data: { _id } })
      .then(() => {
        setManus(manuscripts.filter(m => m._id !== _id));
        setDeleteMessage(`Manuscript "${title}" deleted successfully.`);
      })
      .catch((error) => setError(`Error deleting manuscript: ${error.message}`));
  };

useEffect(fetchManus, []);

return (
    <div className="wrapper">
      <header>
        <h1>Dashboard</h1>
      </header>
       {deleteMessage && (
        <div className="delete-popup">
          {deleteMessage}
        </div>
      )}

     {error && <ErrorMessage message={error} />}
      {manuscripts.map((manuscript) => {
  const isUpdating = updatingManus && updatingManus.title === manuscript.title;
  const isSendingAction = sendingAction && sendingAction.title === manuscript.title;

  return (
    <div key={manuscript.title} className="manuscript-container">
      {isUpdating ? (
        <>
          <div key={manuscript.title} className="manuscript-container">
           <h2>Title: {manuscript.title}</h2>
           <p>Author: {manuscript.author}</p>
           <p>Author Email: {manuscript.author_email}</p>
           <p>Text: {manuscript.text}</p>
           <p>Abstract: {manuscript.abstract}</p>
           <p>Editor Email: {manuscript.editor_email}</p>
           <p>State: {manuscript.state}</p>
           <p>Referees: {manuscript.referee}</p>
           </div>

        <UpdateManuscriptForm
          visible={true}
          manuscript={updatingManus}
          cancel={() => setUpdatingManus(null)}
          fetchManus={fetchManus}
          setError={setError}
        />
        </>
      ) : isSendingAction ? (
        <>
          <div key={manuscript.title} className="manuscript-container">
           <h2>Title: {manuscript.title}</h2>
           <p>Author: {manuscript.author}</p>
           <p>Author Email: {manuscript.author_email}</p>
           <p>Text: {manuscript.text}</p>
           <p>Abstract: {manuscript.abstract}</p>
           <p>Editor Email: {manuscript.editor_email}</p>
           <p>State: {manuscript.state}</p>
           <p>Referees: {manuscript.referee}</p>
           </div>

        <SendActionForm
          visible={true}
          manuscript={sendingAction}
          cancel={() => setSendingAction(null)}
          fetchManus={fetchManus}
          setError={setError}
        />
        </>
      ) : (
        <>
          <h2>Title: {manuscript.title}</h2>
          <p>Author: {manuscript.author}</p>
          <p>Author Email: {manuscript.author_email}</p>
          <p>Text: {manuscript.text}</p>
          <p>Abstract: {manuscript.abstract}</p>
          <p>Editor Email: {manuscript.editor_email}</p>
          <p>State: {manuscript.state}</p>
          <p>Referees: {manuscript.referee}</p>
          <button onClick={() => setUpdatingManus(manuscript)}>Update</button>
          <button onClick={() => setSendingAction(manuscript)}>Send Action</button>
          <button onClick={() => deleteManus(manuscript._id, manuscript.title)}>Delete</button>
        </>
      )}
    </div>
  );
})}
</div>
  );
}



export default Dashboard;