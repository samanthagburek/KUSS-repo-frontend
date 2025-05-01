import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  // useParams,
  useLocation,
  Navigate,
} from 'react-router-dom';

import './App.css';

import Navbar from './Components/Navbar';
import People from './Components/People';
//import Text from './Components/Text';
import Masthead from './Components/Masthead';
import Submission from './Components/Submission';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';
import User from './User'

function AppRoutes() {
  const location = useLocation();
  const isLoggedIn = User.getEmail() !== "";

  // Only allow /login and /register if not logged in
  if (!isLoggedIn && location.pathname !== '/login' && location.pathname !== '/register') {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route index element={<Home />} />
        <Route path="/people" element={<People />} />
        <Route path="/masthead" element={<Masthead />} />
        <Route path="/submission" element={<Submission />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;