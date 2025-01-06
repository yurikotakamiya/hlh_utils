import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import PostList from './Components/PostList';
import PrivateRoute from './Components/PrivateRoute';
import ScoreSheet from './Components/ScoreSheet';
import ScoreHeatmap from './Components/ScoreHeatmap';
import Layout from './Components/Layout';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Layout />}>
                    <Route path="home" element={<PrivateRoute element={Home} />} />
                    <Route path="post-list" element={<PrivateRoute element={PostList} />} />
                    <Route path="score-sheet" element={<PrivateRoute element={ScoreSheet} />} />
                    <Route path="score-heatmap" element={<PrivateRoute element={ScoreHeatmap} />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
