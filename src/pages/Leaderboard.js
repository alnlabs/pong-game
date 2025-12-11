import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSortedLeaderboard, clearLeaderboard } from '../utils/leaderboard';
import { GAME_CONFIG } from '../config/gameConfig';
import './Leaderboard.css';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [sortBy, setSortBy] = useState('wins');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    updateLeaderboard();
  }, [sortBy]);

  const updateLeaderboard = () => {
    const sortedPlayers = getSortedLeaderboard(sortBy);
    setPlayers(sortedPlayers);
  };

  const handleClearLeaderboard = () => {
    if (showClearConfirm) {
      clearLeaderboard();
      setPlayers([]);
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  const getWinRate = (player) => {
    if (player.gamesPlayed === 0) return 0;
    return ((player.wins / player.gamesPlayed) * 100).toFixed(1);
  };

  const getRankIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1 className="leaderboard-title">🏆 Leaderboard</h1>
          <button
            className="leaderboard-back-button"
            onClick={() => navigate('/')}
          >
            ← Home
          </button>
        </div>

        {players.length === 0 ? (
          <div className="leaderboard-empty">
            <div className="empty-icon">📊</div>
            <p>No games played yet!</p>
            <p className="empty-subtitle">Play some games to see rankings here.</p>
            <button
              className="empty-play-button"
              onClick={() => navigate('/')}
            >
              Start Playing
            </button>
          </div>
        ) : (
          <>
            <div className="leaderboard-controls">
              <div className="sort-buttons">
                <button
                  className={`sort-button ${sortBy === 'wins' ? 'active' : ''}`}
                  onClick={() => setSortBy('wins')}
                >
                  Most Wins
                </button>
                <button
                  className={`sort-button ${sortBy === 'winRate' ? 'active' : ''}`}
                  onClick={() => setSortBy('winRate')}
                >
                  Win Rate
                </button>
                <button
                  className={`sort-button ${sortBy === 'gamesPlayed' ? 'active' : ''}`}
                  onClick={() => setSortBy('gamesPlayed')}
                >
                  Games Played
                </button>
                <button
                  className={`sort-button ${sortBy === 'bestScore' ? 'active' : ''}`}
                  onClick={() => setSortBy('bestScore')}
                >
                  Best Score
                </button>
              </div>
              <button
                className="clear-button"
                onClick={handleClearLeaderboard}
              >
                {showClearConfirm ? 'Confirm Clear?' : 'Clear Leaderboard'}
              </button>
            </div>

            <div className="leaderboard-list">
              {players.map((player, index) => (
                <div
                  key={player.name}
                  className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}
                >
                  <div className="rank-badge">
                    {getRankIcon(index)}
                  </div>
                  <div className="player-info">
                    <div className="player-name">{player.name}</div>
                    <div className="player-stats">
                      <span className="stat-item">
                        <span className="stat-label">Wins:</span>
                        <span className="stat-value">{player.wins}</span>
                      </span>
                      <span className="stat-item">
                        <span className="stat-label">Losses:</span>
                        <span className="stat-value">{player.losses}</span>
                      </span>
                      <span className="stat-item">
                        <span className="stat-label">Win Rate:</span>
                        <span className="stat-value">{getWinRate(player)}%</span>
                      </span>
                      <span className="stat-item">
                        <span className="stat-label">Games:</span>
                        <span className="stat-value">{player.gamesPlayed}</span>
                      </span>
                      {player.bestScore > 0 && (
                        <span className="stat-item">
                          <span className="stat-label">Best:</span>
                          <span className="stat-value">{player.bestScore}</span>
                        </span>
                      )}
                    </div>
                    <div className="player-footer">
                      <span className="last-played">Last played: {formatDate(player.lastPlayed)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
