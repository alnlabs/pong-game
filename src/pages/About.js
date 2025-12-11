import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GAME_CONFIG } from '../config/gameConfig';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-header">
          <h1 className="about-title">About Pong Game</h1>
          <button 
            className="about-back-button"
            onClick={() => navigate('/')}
          >
            ← Home
          </button>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2 className="about-section-title">Game Description</h2>
            <p className="about-text">
              A modern, feature-rich Pong game built with React. Experience the classic arcade action 
              with exciting new twists including dynamic obstacles, multiple game modes, and 
              competitive online multiplayer.
            </p>
          </section>

          <section className="about-section">
            <h2 className="about-section-title">Game Modes</h2>
            <div className="about-list">
              <div className="about-list-item">
                <strong>2-Player Local:</strong> Compete head-to-head with a friend on the same device
              </div>
              <div className="about-list-item">
                <strong>vs AI:</strong> Play against computer-controlled opponent with 3 difficulty levels
              </div>
              <div className="about-list-item">
                <strong>Online Multiplayer:</strong> Play against other players online in real-time
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2 className="about-section-title">Game Rules</h2>
            <div className="about-list">
              <div className="about-list-item">
                1. Each player controls a paddle at opposite ends of the screen
              </div>
              <div className="about-list-item">
                2. Hit the ball with your paddle to reflect it toward your opponent
              </div>
              <div className="about-list-item">
                3. Score a point when the ball passes your opponent's goal line
              </div>
              <div className="about-list-item">
                4. First player to reach {GAME_CONFIG.WIN_SCORE} points wins
              </div>
              <div className="about-list-item">
                5. Ball speed increases every {GAME_CONFIG.SPEED_INCREASE_INTERVAL} hits
              </div>
              <div className="about-list-item">
                6. Avoid holes (they reset the ball) and use poles strategically
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2 className="about-section-title">Features</h2>
            <div className="about-features">
              <div className="about-feature">
                <span className="about-feature-icon">⚡</span>
                <span>Gradually Increasing Speed</span>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon">🕳️</span>
                <span>Dynamic Obstacles</span>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon">🎮</span>
                <span>Multiple Game Modes</span>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon">🌐</span>
                <span>Online Multiplayer</span>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon">📱</span>
                <span>Mobile-First Design</span>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2 className="about-section-title">Controls</h2>
            <div className="about-list">
              <div className="about-list-item">
                <strong>Player 1 (Top):</strong> A (left) / D (right)
              </div>
              <div className="about-list-item">
                <strong>Player 2 (Bottom):</strong> ← (left) / → (right)
              </div>
              <div className="about-list-item">
                <strong>Pause:</strong> Space or Esc
              </div>
              <div className="about-list-item">
                <strong>Mobile:</strong> Use on-screen arrow buttons
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2 className="about-section-title">Version</h2>
            <p className="about-text">
              Version 1.0.0
            </p>
            <p className="about-text">
              Built with React, Firebase, and Socket.io
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
