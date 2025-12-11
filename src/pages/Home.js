import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GAME_CONFIG } from '../config/gameConfig';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="home-title">PONG GAME</h1>
        <p className="home-subtitle">Classic arcade action with modern twists</p>
        
        <div className="home-buttons">
          <button 
            className="home-button primary"
            onClick={() => navigate('/game')}
          >
            Play Now
          </button>
        </div>

        <div className="home-menu">
          <button 
            className="home-menu-button"
            onClick={() => navigate('/help')}
          >
            📖 How to Play
          </button>
          <button 
            className="home-menu-button"
            onClick={() => navigate('/settings')}
          >
            ⚙️ Settings
          </button>
          <button 
            className="home-menu-button"
            onClick={() => navigate('/about')}
          >
            ℹ️ About
          </button>
        </div>

        <div className="home-features">
          <div className="feature-item">
            <span className="feature-icon">🎮</span>
            <span>Multiple Game Modes</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span>Dynamic Obstacles</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🏆</span>
            <span>Competitive Play</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
