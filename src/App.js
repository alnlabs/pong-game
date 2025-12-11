import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Settings from './pages/Settings';
import About from './pages/About';
import Help from './pages/Help';
import Leaderboard from './pages/Leaderboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
