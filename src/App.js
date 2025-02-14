import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
} from 'react-router-dom';

import './App.css';

import Navbar from './Components/Navbar';
import People from './Components/People';

function PersonPage() {
  const { name } = useParams();
  return <h1>{name}</h1>
}

const homeHeader = "Journal";

function Home(){
  const styles = {
    'textAlign': 'center',
  }
  return <h1 style={styles}>{homeHeader}</h1>
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route index element={<Home/>}/>
        <Route path="people" element={<People />} />
        <Route path="people/:name" element={<PersonPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
