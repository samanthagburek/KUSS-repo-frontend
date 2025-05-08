import React, { useEffect,useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Dashboard.css';
import User from '../../User';


const MANUSCRIPTS_ENDPOINT = `${BACKEND_URL}/manuscripts`;
const MANUSCRIPTS_RECEIVE_ACTION_ENDPOINT = `${BACKEND_URL}/manuscripts/receive_action`;
const MANUSCRIPTS_WITHDRAW_ENDPOINT = `${BACKEND_URL}/manuscripts/receive_withdraw`;
const VALID_ACTIONS_BY_STATE_ENDPOINT = `${MANUSCRIPTS_ENDPOINT}/valid_actions`;
const MANUSCRIPTS_STATES_ENDPOINT = `${BACKEND_URL}/manuscripts/states`;

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
  const currUserRoles = User.getRoles();
  const isEditor = currUserRoles.some(role => ['ME', 'CE', 'ED'].includes(role));

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
        {isEditor && (
        <>
        <label htmlFor="author_email">Author Email</label>
        <input type="email" id="author_email" value={author_email} onChange={changeAuthorEmail} readOnly={!isEditor} />
        </>)}
        <label htmlFor="text">Text</label>
        <textarea id="text" value={text} onChange={changeText} />

        <label htmlFor="abstract">Abstract</label>
        <textarea id="abstract" value={abstract} onChange={changeAbstract}/>

        {isEditor && (
        <>
        <label htmlFor="editor_email">Editor Email</label>
        <input type="email" id="editor_email" value={editor_email} onChange={changeEditorEmail} />
        </>)}
        
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
  const [ref, SetRef] = useState('');
  const [actionOptions, setActionOptions] = useState([]);

  const [newState, setNewState] = useState('');
  const [stateOptions, setStateOptions] = useState({});

  const [report, setReport] = useState('');
  const [verdict, setVerdict] = useState('');
  const [verdictOptions, setVerdictOptions] = useState({});

  const changeAction = (event) => { SetAction(event.target.value); };
  const changeRef = (event) => {SetRef(event.target.value);}
  

useEffect(() => {
   if (manuscript) {
    setTitle(manuscript.title);
    }
  }, [manuscript]);
const getActions = () => {
  if (!manuscript || !manuscript.state) return;

  axios.post(VALID_ACTIONS_BY_STATE_ENDPOINT, { state: manuscript.state })
    .then(({ data }) => {
      setActionOptions(data.actions);
    })
    .catch((error) => {
      setError(`There was a problem getting actions for state ${manuscript.state}. ${error.message}`);
    });
};
useEffect(getActions, []);

useEffect(() => {
  axios.get(`${MANUSCRIPTS_ENDPOINT}/verdicts`)
    .then(({ data }) => setVerdictOptions(data))
    .catch((error) => setError(`Error loading verdict options: ${error.message}`));
}, []);

useEffect(() => {
  axios.get(`${MANUSCRIPTS_STATES_ENDPOINT}`)
    .then(({data}) => setStateOptions(data))
    .catch((error) => setError(`Error loading states: ${error.message}`))
}, []);

  const updateManuscript = (event) => {
    event.preventDefault();

    const actionForm = {
      _id: manuscript._id,
      curr_state: manuscript.state,
      action: action,
      referee: ref, //this should change
      new_state: newState,
      referee_report: report,
      referee_verdict: verdict,
    };

    console.log("Submitting actionForm:", actionForm);
    axios.put(MANUSCRIPTS_RECEIVE_ACTION_ENDPOINT, actionForm)
      .then(() => {
        setUpdateMessage(`"${title}" updated successfully!`);
        setTimeout(() => {
          setUpdateMessage('');
          cancel();
          fetchManus();
        }, 2000);
      })
      .catch((error) => setError(`Error updating "${manuscript._id}""${actionForm.curr_state}""${action}" manuscript: ${error.message}`));
  };
if (!visible) return null;
const isEditor = User.getRoles().some(role => ['ME', 'CE', 'ED'].includes(role)); 

return (
    <div>
    {updateMessage && <div className="update-popup">{updateMessage}</div>}
    <form className="dashboard-container">
    <select name='sendAction' onChange={changeAction}>
      <option value="">Select an action</option>
      {Object.entries(actionOptions)
        .filter(([code]) => isEditor || code !== 'EDMOV')
        .map(([code, label]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
    </select>

    {(action === 'ARF')&& (
    <div>
    <label htmlFor="author">Enter Referee Email</label>
    <input type="text" id="ref" value={ref} onChange={changeRef} />
    </div>
    )}

    {['DRF', 'SUBREV'].includes(action) && (
      <div>
        <label htmlFor="ref">Select Referee</label>
        <select id="ref" value={ref} onChange={changeRef}>
          <option value="">Select a referee</option>
          {manuscript.referees && Object.keys(manuscript.referees).map((email) => (
            <option key={email} value={email}>{email}</option>
          ))}
        </select>
      </div>
    )}

    {action === 'EDMOV' && (
      <>
        <label htmlFor="newState">Select New State</label>
        <select id="newState" value={newState} onChange={(e) => setNewState(e.target.value)}>
          <option value="">Select a state</option>
          {Object.entries(stateOptions)
            .filter(([code]) => code != manuscript.state)
            .map(([code, label]) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select> <br></br><br></br>
      </>
    )}
        
    {(action === 'SUBREV') && manuscript.state === 'REV' && (
    <>
    <label htmlFor="report">Referee Report</label>
    <textarea
      id="report"
      value={report}
      onChange={(e) => setReport(e.target.value)}
    />

    <label htmlFor="verdict">Referee Verdict</label>
    <select
      id="verdict"
      value={verdict}
      onChange={(e) => setVerdict(e.target.value)}
    >
    <option value="">Select a verdict</option>
    {Object.entries(verdictOptions).map(([code, label]) => (
      <option key={code} value={code}>{label}</option>
    ))}
    </select>
  </>
)}

    <button type="button" onClick={cancel}>Cancel</button>
    <button type="submit" onClick={updateManuscript}>Update</button>
    </form>
    </div>
 );
}
SendActionForm.propTypes = {
  visible: propTypes.bool.isRequired,
  manuscript: propTypes.shape({
      _id: propTypes.string.isRequired,
      title: propTypes.string.isRequired,
      author: propTypes.string.isRequired,
      author_email: propTypes.string.isRequired,
      text: propTypes.string.isRequired,
      abstract: propTypes.string.isRequired,
      state: propTypes.string.isRequired,
      editor_email: propTypes.string.isRequired,
      referees: propTypes.objectOf(
      propTypes.shape({
    referee_report: propTypes.string,
    referee_verdict: propTypes.string,
  })
),}).isRequired,

  cancel: propTypes.func.isRequired,
  fetchManus: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

function DisplayManuscriptDetails({ manuscript, stateLabels }) {
  return (
    <>
      <h2>Title: {manuscript.title}</h2>
      <p>Author: {manuscript.author}</p>
      <p>Author Email: {manuscript.author_email}</p>
      <p>
        Text: {manuscript.text}
      </p>
      <p>Abstract: {manuscript.abstract}</p>
      <p>Editor Email: {manuscript.editor_email}</p>
      <p>State: {stateLabels[manuscript.state]}</p>
     <div>
  <p><strong>Referees:</strong></p>
  {manuscript.referees && Object.keys(manuscript.referees).length > 0 ? (
    Object.entries(manuscript.referees).map(([email, data]) => (
      <div key={email} style={{ marginBottom: '1rem', paddingLeft: '1rem' }}>
        <p><a href={`mailto:${email}`}>{email}</a></p>
        {data.referee_report && data.referee_report !== "string" && (
          <p><strong>Report:</strong> {data.referee_report}</p>
        )}
        {data.referee_verdict && data.referee_verdict !== "string" && (
          <p><strong>Verdict:</strong> {data.referee_verdict}</p>
        )}
      </div>
    ))
  ) : (
    <p>None</p>
  )}
</div>

      
    </>
  );
}

DisplayManuscriptDetails.propTypes = {
  manuscript: propTypes.object.isRequired,
  stateLabels: propTypes.object.isRequired,
};

function Dashboard() {
  const [error, setError] = useState('');
  const [manuscripts, setManus] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [updatingManus, setUpdatingManus] = useState(null);
  const [sendingAction, setSendingAction] = useState(null);
  const [stateLabels, setStateLabels] = useState({});
  const [orderedStates, setOrderedStates] = useState([]);
  const [collapsedStates, setCollapsedStates] = useState({});
  const [currUserEmail, setUserEmail] = useState('');
  const [currUserRoles, setUserRoles] = useState([]);



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


  useEffect(() => {
    setUserRoles(User.getRoles());
    setUserEmail(User.getEmail());
    axios.get(`${MANUSCRIPTS_STATES_ENDPOINT}`)
      .then(({ data }) => {
        setStateLabels(data);
        setOrderedStates(Object.keys(data));
      })
      .catch((error) => setError(`Error loading all state labels: ${error.message}`));
  }, []);

const fetchManus = () => {
    axios.get(MANUSCRIPTS_ENDPOINT)
      .then(({ data }) => {
        console.log("Fetched manuscripts:", data);
        setManus(Object.values(data));
      })
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

const doWithdraw = (_id, title) => {
    const confirmDelete = window.confirm(`Are you sure you want to withdraw "${title}"?`);
    if (!confirmDelete) return;

    const withdrawManu = {
      _id : _id
    };

    axios.put(MANUSCRIPTS_WITHDRAW_ENDPOINT, withdrawManu)
      .then(() => {
        setDeleteMessage(`Manuscript "${_id}" withdrawn successfully.`);
        fetchManus();
      })
      .catch((error) => setError(`Error deleting manuscript: ${error.message}`));
  };

useEffect(fetchManus, []);

const toggleCollapse = (stateCode) => {
  setCollapsedStates((prev) => ({
    ...prev,
    [stateCode]: !prev[stateCode],
  }));
};

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
     
     {orderedStates.map((stateCode) => {
        const isEditor = currUserRoles.some(role => ['ME', 'CE', 'ED'].includes(role));
        const stateManuscripts = manuscripts.filter((m) => {
        const isAuthor = m.author_email === currUserEmail;
        const isReferee = m.referees && Object.keys(m.referees).some(email => email === currUserEmail);
        const isVisibleState = !['WIT', 'REJ', 'PUB'].includes(m.state);

        if (!isVisibleState || m.state !== stateCode) return false;

        return isEditor || isAuthor || isReferee;
      });


        if (stateManuscripts.length === 0) return null;

        return (
          <div key={stateCode}>
            <div className="state-header">
              <button onClick={() => toggleCollapse(stateCode)} className={collapsedStates[stateCode] ? "toggled": ""}>{stateLabels[stateCode]}</button>
            </div>
            
            {!collapsedStates[stateCode] && stateManuscripts.map((manuscript) => {
              const isUpdating = updatingManus && updatingManus._id === manuscript._id;
              const isSendingAction = sendingAction && sendingAction._id === manuscript._id;

              return (
                <div key={manuscript._id} className="manuscript-container">
                  {isUpdating ? (
                    <>
                      <DisplayManuscriptDetails manuscript={manuscript} stateLabels={stateLabels} />
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
                      <DisplayManuscriptDetails manuscript={manuscript} stateLabels={stateLabels} />
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
                      <DisplayManuscriptDetails manuscript={manuscript} stateLabels={stateLabels} />
                      {currUserRoles.some(role => ['ME', 'CE', 'ED'].includes(role)) && manuscript.author_email !== currUserEmail && (
                        <>
                          <button onClick={() => setUpdatingManus(manuscript)}>Update</button>
                          <button onClick={() => setSendingAction(manuscript)}>Send Action</button>
                          <button onClick={() => deleteManus(manuscript._id, manuscript.title)}>Delete</button>
                        </>
                      )}

                      {manuscript.author_email === currUserEmail &&
                      ['AUREVIEW', 'AUREVISION'].includes(manuscript.state) &&
                      !currUserRoles.some(role => ['ME', 'CE', 'ED'].includes(role)) && (
                        <>
                          <button onClick={() => setUpdatingManus(manuscript)}>Update</button>
                          <button onClick={() => setSendingAction(manuscript)}>Send Action</button>
                          <button onClick={() => doWithdraw(manuscript._id, manuscript.title)}>Withdraw</button>
                        </>
                      )}

                      { manuscript.author_email === currUserEmail && !currUserRoles.some(role => ['ME', 'CE', 'ED'].includes(role)) && (
                        <>
                          <button onClick={() => setUpdatingManus(manuscript)}>Update</button>
                          <button onClick={() => doWithdraw(manuscript._id, manuscript.title)}>Withdraw</button>

                        </>
                      )}

                      {manuscript.author_email === currUserEmail && currUserRoles.some(role => ['ME', 'CE', 'ED'].includes(role)) && (
                        <>
                          <button onClick={() => setUpdatingManus(manuscript)}>Update</button>
                          <button onClick={() => setSendingAction(manuscript)}>Send Action</button>
                          <button onClick={() => doWithdraw(manuscript._id, manuscript.title)}>Withdraw</button>
                          <button onClick={() => deleteManus(manuscript._id, manuscript.title)}>Delete</button>
                        </>
                      )}
                    
                   {manuscript.referees && Object.keys(manuscript.referees).includes(currUserEmail) &&
                   manuscript.state === 'REV' && (
                    <>
                      <button onClick={() => setUpdatingManus(manuscript)}>Update</button>
                      <button onClick={() => setSendingAction(manuscript)}>Send Action</button>
                    </>
                  )}
                   </>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Dashboard;
