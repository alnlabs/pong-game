import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GAME_CONFIG } from '../config/gameConfig';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [winScore, setWinScore] = useState(GAME_CONFIG.WIN_SCORE);
  const [obstaclesEnabled, setObstaclesEnabled] = useState(GAME_CONFIG.OBSTACLES_ENABLED);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedWinScore = localStorage.getItem('pong_winScore');
    const savedObstacles = localStorage.getItem('pong_obstaclesEnabled');
    const savedSound = localStorage.getItem('pong_soundEnabled');

    if (savedWinScore) setWinScore(parseInt(savedWinScore));
    if (savedObstacles !== null) setObstaclesEnabled(savedObstacles === 'true');
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');
  }, []);

  const handleSave = () => {
    localStorage.setItem('pong_winScore', winScore.toString());
    localStorage.setItem('pong_obstaclesEnabled', obstaclesEnabled.toString());
    localStorage.setItem('pong_soundEnabled', soundEnabled.toString());
    alert('Settings saved!');
  };

  const handleReset = () => {
    setWinScore(GAME_CONFIG.WIN_SCORE);
    setObstaclesEnabled(GAME_CONFIG.OBSTACLES_ENABLED);
    setSoundEnabled(true);
    localStorage.removeItem('pong_winScore');
    localStorage.removeItem('pong_obstaclesEnabled');
    localStorage.removeItem('pong_soundEnabled');
    alert('Settings reset to default!');
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <button 
            className="settings-back-button"
            onClick={() => navigate('/')}
          >
            ← Home
          </button>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">Game Settings</h2>
          
          <div className="settings-item">
            <label className="settings-label">
              Win Score: {winScore}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={winScore}
              onChange={(e) => setWinScore(parseInt(e.target.value))}
              className="settings-slider"
            />
            <div className="settings-hint">First to reach this score wins</div>
          </div>

          <div className="settings-item">
            <label className="settings-label">
              <input
                type="checkbox"
                checked={obstaclesEnabled}
                onChange={(e) => setObstaclesEnabled(e.target.checked)}
                className="settings-checkbox"
              />
              Enable Obstacles
            </label>
            <div className="settings-hint">Holes and poles appear during gameplay</div>
          </div>

          <div className="settings-item">
            <label className="settings-label">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="settings-checkbox"
              />
              Sound Effects
            </label>
            <div className="settings-hint">Enable game sound effects (coming soon)</div>
          </div>
        </div>

        <div className="settings-actions">
          <button 
            className="settings-button primary"
            onClick={handleSave}
          >
            Save Settings
          </button>
          <button 
            className="settings-button secondary"
            onClick={handleReset}
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
