import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import PostList from './Components/PostList.js';
import PrivateRoute from './Components/PrivateRoute';
import ScoreSheet from './Components/ScoreSheet.js';
import ScoreHeatmap from './Components/ScoreHeatmap.js';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} /> 
                <Route path="/home" element={<PrivateRoute element={Home} />} />
                <Route path="/post-list" element={<PrivateRoute element={PostList} />} />
                <Route path="/score-sheet" element={<PrivateRoute element={ScoreSheet} />} />
                <Route path="/score-heatmap" element={<PrivateRoute element={ScoreHeatmap} />} />
            </Routes>
        </Router>
    );
}

export default App;
