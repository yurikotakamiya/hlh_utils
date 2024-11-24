import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
// import Register from './Components/Register';
import PrivateRoute from './Components/PrivateRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                {/* <Route path="/register" element={<Register />} /> */} 
                <Route path="/home" element={<PrivateRoute element={Home} />} />
            </Routes>
        </Router>
    );
}

export default App;
