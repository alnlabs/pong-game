// Leaderboard utility - manages player statistics and rankings

const LEADERBOARD_STORAGE_KEY = 'pong_game_leaderboard';

// Get all leaderboard entries
export const getLeaderboard = () => {
  try {
    const data = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return {};
  }
};

// Save leaderboard data
const saveLeaderboard = (leaderboard) => {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaderboard));
  } catch (error) {
    console.error('Error saving leaderboard:', error);
  }
};

// Record a game result
export const recordGameResult = (playerName, won, finalScore, opponentName = null, gameMode = '2player') => {
  const leaderboard = getLeaderboard();
  
  // Initialize player if doesn't exist
  if (!leaderboard[playerName]) {
    leaderboard[playerName] = {
      name: playerName,
      wins: 0,
      losses: 0,
      gamesPlayed: 0,
      totalScore: 0,
      bestScore: 0,
      lastPlayed: null,
      gameModes: {}
    };
  }
  
  const player = leaderboard[playerName];
  
  // Update stats
  player.gamesPlayed += 1;
  player.lastPlayed = new Date().toISOString();
  
  if (won) {
    player.wins += 1;
    if (finalScore > player.bestScore) {
      player.bestScore = finalScore;
    }
  } else {
    player.losses += 1;
  }
  
  player.totalScore += finalScore;
  
  // Track game mode stats
  if (!player.gameModes[gameMode]) {
    player.gameModes[gameMode] = { wins: 0, games: 0 };
  }
  player.gameModes[gameMode].games += 1;
  if (won) {
    player.gameModes[gameMode].wins += 1;
  }
  
  saveLeaderboard(leaderboard);
  return player;
};

// Get player stats
export const getPlayerStats = (playerName) => {
  const leaderboard = getLeaderboard();
  return leaderboard[playerName] || null;
};

// Get sorted leaderboard (by wins, then win rate)
export const getSortedLeaderboard = (sortBy = 'wins') => {
  const leaderboard = getLeaderboard();
  const players = Object.values(leaderboard);
  
  return players.sort((a, b) => {
    if (sortBy === 'wins') {
      // Sort by wins (descending), then by win rate
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      const aWinRate = a.gamesPlayed > 0 ? a.wins / a.gamesPlayed : 0;
      const bWinRate = b.gamesPlayed > 0 ? b.wins / b.gamesPlayed : 0;
      return bWinRate - aWinRate;
    } else if (sortBy === 'winRate') {
      // Sort by win rate (descending), then by wins
      const aWinRate = a.gamesPlayed > 0 ? a.wins / a.gamesPlayed : 0;
      const bWinRate = b.gamesPlayed > 0 ? b.wins / b.gamesPlayed : 0;
      if (bWinRate !== aWinRate) {
        return bWinRate - aWinRate;
      }
      return b.wins - a.wins;
    } else if (sortBy === 'gamesPlayed') {
      // Sort by games played (descending)
      return b.gamesPlayed - a.gamesPlayed;
    } else if (sortBy === 'bestScore') {
      // Sort by best score (descending)
      return b.bestScore - a.bestScore;
    }
    return 0;
  });
};

// Clear leaderboard (for testing/reset)
export const clearLeaderboard = () => {
  localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
};

// Get top N players
export const getTopPlayers = (n = 10, sortBy = 'wins') => {
  return getSortedLeaderboard(sortBy).slice(0, n);
};
