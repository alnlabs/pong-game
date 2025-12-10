// Socket Manager - Handles WebSocket connections for online multiplayer
import io from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.roomId = null;
    this.playerNumber = null;
    this.callbacks = {
      onConnect: null,
      onDisconnect: null,
      onRoomCreated: null,
      onRoomJoined: null,
      onGameReady: null,
      onOpponentPaddleMove: null,
      onGameStateSync: null,
      onScoreSync: null,
      onGameOverSync: null,
      onGameRestart: null,
      onOpponentDisconnected: null,
      onRoomError: null
    };
  }

  connect(serverUrl = 'http://localhost:3001') {
    if (this.socket && this.connected) {
      return;
    }

    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('Connected to server');
      if (this.callbacks.onConnect) {
        this.callbacks.onConnect();
      }
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('Disconnected from server');
      if (this.callbacks.onDisconnect) {
        this.callbacks.onDisconnect();
      }
    });

    this.socket.on('roomCreated', (data) => {
      this.roomId = data.roomId;
      this.playerNumber = data.playerNumber;
      if (this.callbacks.onRoomCreated) {
        this.callbacks.onRoomCreated(data);
      }
    });

    this.socket.on('roomJoined', (data) => {
      this.roomId = data.roomId;
      this.playerNumber = data.playerNumber;
      if (this.callbacks.onRoomJoined) {
        this.callbacks.onRoomJoined(data);
      }
    });

    this.socket.on('gameReady', (data) => {
      if (this.callbacks.onGameReady) {
        this.callbacks.onGameReady(data);
      }
    });

    this.socket.on('opponentPaddleMove', (data) => {
      if (this.callbacks.onOpponentPaddleMove) {
        this.callbacks.onOpponentPaddleMove(data);
      }
    });

    this.socket.on('gameStateSync', (data) => {
      if (this.callbacks.onGameStateSync) {
        this.callbacks.onGameStateSync(data);
      }
    });

    this.socket.on('scoreSync', (data) => {
      if (this.callbacks.onScoreSync) {
        this.callbacks.onScoreSync(data);
      }
    });

    this.socket.on('gameOverSync', (data) => {
      if (this.callbacks.onGameOverSync) {
        this.callbacks.onGameOverSync(data);
      }
    });

    this.socket.on('gameRestart', () => {
      if (this.callbacks.onGameRestart) {
        this.callbacks.onGameRestart();
      }
    });

    this.socket.on('opponentDisconnected', () => {
      if (this.callbacks.onOpponentDisconnected) {
        this.callbacks.onOpponentDisconnected();
      }
    });

    this.socket.on('roomError', (data) => {
      if (this.callbacks.onRoomError) {
        this.callbacks.onRoomError(data);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.roomId = null;
      this.playerNumber = null;
    }
  }

  createRoom(roomId) {
    if (this.socket && this.connected) {
      this.socket.emit('createRoom', roomId);
    }
  }

  joinRoom(roomId) {
    if (this.socket && this.connected) {
      this.socket.emit('joinRoom', roomId);
    }
  }

  sendPaddleMove(x, direction) {
    if (this.socket && this.connected && this.roomId) {
      this.socket.emit('paddleMove', { x, direction });
    }
  }

  sendGameStateUpdate(gameState) {
    if (this.socket && this.connected && this.roomId) {
      this.socket.emit('gameStateUpdate', gameState);
    }
  }

  sendScoreUpdate(score1, score2) {
    if (this.socket && this.connected && this.roomId) {
      this.socket.emit('scoreUpdate', { score1, score2 });
    }
  }

  sendGameOver(winner) {
    if (this.socket && this.connected && this.roomId) {
      this.socket.emit('gameOver', { winner });
    }
  }

  sendRestartGame() {
    if (this.socket && this.connected && this.roomId) {
      this.socket.emit('restartGame');
    }
  }

  on(event, callback) {
    if (this.callbacks.hasOwnProperty(`on${event.charAt(0).toUpperCase() + event.slice(1)}`)) {
      this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = callback;
    }
  }

  isConnected() {
    return this.connected;
  }

  getRoomId() {
    return this.roomId;
  }

  getPlayerNumber() {
    return this.playerNumber;
  }
}

// Export singleton instance
export default new SocketManager();

