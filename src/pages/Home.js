import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GAME_CONFIG } from '../config/gameConfig';
import GameModeModal from '../components/GameModeModal';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handlePlayNow = () => {
    setShowModal(true);
  };

  const handleSelectMode = (mode) => {
    setShowModal(false);
    // Mode can include difficulty parameter for AI mode (e.g., "ai?difficulty=hard")
    if (mode.includes('?')) {
      const [modeName, params] = mode.split('?');
      navigate(`/game?mode=${modeName}&${params}`);
    } else {
      navigate(`/game?mode=${mode}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="home-title">PONG GAME</h1>
        <p className="home-subtitle">Classic arcade action with modern twists</p>
        
        <div className="home-buttons">
          <button 
            className="home-button primary"
            onClick={handlePlayNow}
          >
            Play Now
          </button>
        </div>

        {showModal && (
          <GameModeModal
            onClose={handleCloseModal}
            onSelectMode={handleSelectMode}
          />
        )}

        <div className="home-menu">
          <button 
            className="home-menu-button"
            onClick={() => navigate('/leaderboard')}
          >
            🏆 Leaderboard
          </button>
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
