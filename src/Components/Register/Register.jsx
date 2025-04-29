import React, { useEffect,useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Register.css';
const TEXT_READ_ENDPOINT = `${BACKEND_URL}/text`;


const PEOPLE_CREATE_ENDPOINT = `${BACKEND_URL}/people`;
const ROLES_ENDPOINT = `${BACKEND_URL}/roles`

function AddPersonForm({
    visible,
    cancel,
    setError,
}) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [affiliation, setAffiliation] = useState('');
    const [roles, setRoles] = useState([]);
    const [roleOptions, setRoleOptions] = useState('');
    const [addMsg, setAddsMsg] = useState('');

    const changeName = (event) => { setName(event.target.value); };
    const changePassword = (event) => { setPassword(event.target.value); };
    const changeEmail = (event) => { setEmail(event.target.value); };
    const changeAffiliation = (event) => { setAffiliation(event.target.value); };
    const changeRoles = (event) => {
        if (roles.includes(event.target.value)) {
            setRoles(
                roles.filter(a =>
                    a !== event.target.value
                )
            );
        } else {
            setRoles([
                ...roles,
                event.target.value
            ]);
        }
    }

    const addPerson = (event) => {
        event.preventDefault();
        const newPerson = {
            name: name,
            email: email,
            password: password,
            roles: roles,
            affiliation: affiliation,
        }
        axios.put(PEOPLE_CREATE_ENDPOINT, newPerson)
            .then(() => {
                setAddsMsg(`${name} has been added successfully!`);
                setTimeout(() => {
                    setAddsMsg('');
                    cancel();
                }, 3000);
            })
            .catch((error) => {
                setError(`There was a problem adding the person. ${error}`);
            });
    };
    const getRoles = () => {
        axios.get(ROLES_ENDPOINT)
            .then(({ data }) => { setRoleOptions(data) })
            .catch((error) => { setError(`There was a problem getting roles. ${error}`); });
    }
    useEffect(getRoles, []);

    if (!visible) return null;
    return (
        <div>
            {addMsg && <div className="add-popup">{addMsg}</div>}
            <form>
                <label htmlFor="name">
                    Name
                </label>
                <input required type="text" id="name" value={name} onChange={changeName} />
                <label htmlFor="email">
                    Email
                </label>
                <input required type="text" id="email" onChange={changeEmail} />
                <label htmlFor="password">
                    Password
                </label>
                <input required type="text" id="password" onChange={changePassword} />
                <label htmlFor="affiliation">
                    Affiliation
                </label>
                <input required type="text" id="affiliation" onChange={changeAffiliation} />

                <label htmlFor="role">
                    Roles
                </label>
                <div className="roles-container">
                    {
                        Object.keys(roleOptions).map((code) => (
                            <div key={code} className="role">
                                <input type="checkbox" id={code} value={code} onChange={changeRoles} defaultChecked={roles.includes(code)} />
                                <p>{roleOptions[code]}</p>
                            </div>
                        ))
                    }
                </div>
                <button type="button" onClick={cancel}>Cancel</button>
                <button type="button" onClick={addPerson}>Submit</button>
            </form>
        </div>
    );
}
AddPersonForm.propTypes = {
    visible: propTypes.bool.isRequired,
    cancel: propTypes.func.isRequired,
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

function Submission() {
    const [error, setError] = useState('');
    const [addingManus, setAddingManus] = useState(false);
    const [tosText, settosText] = useState('');
    const [tosTitle, settosTitle] =  useState('');
    const [hasReadGuidelines, setHasReadGuidelines] = useState(false);
    const [isEditingGuide, setIsEditingGuide] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (error) {
        const timer = setTimeout(() => setError(''), 10000);
        return () => clearTimeout(timer);
        }
    }, [error])

     useEffect(() => {
        axios.get(TEXT_READ_ENDPOINT)
            .then(({ data }) => {
                const tos = Object.values(data).find(text => text.key === "terms_of_service");
                if (tos) {
                    settosText(tos.text);
                    settosTitle(tos.title);
                }
            })
            .catch(error => setError(`Error fetching submission guidelines: ${error}`));
    }, []);


    const updateSubmissionGuidelines = () => {
    const updatedText = {
        key: "terms_of_service",
        title: tosTitle,
        text: tosText,
    };

    axios.patch(TEXT_READ_ENDPOINT, updatedText)
        .then(() => {
            setIsEditingGuide(false);
            setSuccessMessage(`${tosTitle} updated!`);
            setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch(error => setError(`Error updating submission guidelines: ${error.message}`));
}


    return (
        <>
    <div className="tos-container">
    <h2 className="guidelines-title">{tosTitle}</h2>
    
    {isEditingGuide ? (
        <textarea
            value={tosText}
            onChange={(e) => settosText(e.target.value)}
            rows={6}
            style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '10px' }}
        />
    ) : (
        <p>{tosText}</p>
    )}

    <button onClick={isEditingGuide ? updateSubmissionGuidelines : () => setIsEditingGuide(true)}>
        {isEditingGuide ? 'Save' : 'Edit'}
    </button>
</div>

    {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    {successMessage && (
    <div className="popup-message">
        {successMessage}
    </div>
)}
    <div className="checkbox-wrapper">
        <input
            type="checkbox"
            id="guidelinesCheck"
            checked={hasReadGuidelines}
            onChange={() => setHasReadGuidelines(!hasReadGuidelines)}
        />
        <label htmlFor="guidelinesCheck">I have read and agree to the user TOS</label>
        </div>
    <div className="wrapper">

        {!addingManus ? (
            <button onClick={() => setAddingManus(true)}>Create an Account</button>
        ) : (
            <h2 className="submit-manuscript-heading">Create an Account</h2>
        )}

        
        <AddPersonForm
            visible={addingManus}
            cancel={() => setAddingManus(false)}
            setError={setError}
            hasReadGuidelines={hasReadGuidelines}
            setHasReadGuidelines={setHasReadGuidelines}
        />
    </div>
    </>
    );
}




export default Submission;