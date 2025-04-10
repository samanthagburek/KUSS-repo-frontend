import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  // useParams,
} from 'react-router-dom';

import './App.css';

import Navbar from './Components/Navbar';
import People from './Components/People';
//import Text from './Components/Text';
import Masthead from './Components/Masthead';
import Submission from './Components/Submission';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';

// function PersonPage() {
//   const { name } = useParams();
//   return <h1>{name}</h1>
// }

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route index element={<Home/>}/>
        <Route path="people" element={<People />} />
        <Route path="masthead" element={<Masthead />} />
        <Route path="submission" element={<Submission />} />
        <Route path="dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
