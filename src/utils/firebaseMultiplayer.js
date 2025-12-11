// Firebase Multiplayer Manager - Handles online multiplayer using Firebase Realtime Database
import { database } from '../config/firebaseConfig';
import { auth } from '../config/firebaseConfig';
import { ref, set, onValue, off, push, remove, update, get } from 'firebase/database';

class FirebaseMultiplayer {
  constructor() {
    this.connected = false;
    this.roomId = null;
    this.playerNumber = null;
    this.playerId = null;
    this.roomRef = null;
    this.gameReadyTriggered = false; // Prevent duplicate GameReady calls
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

  getPlayerId() {
    // Use authenticated user ID if available, otherwise generate one
    if (auth.currentUser) {
      return auth.currentUser.uid;
    }
    return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async connect() {
    if (this.connected) {
      return;
    }

    // Wait for auth if not already authenticated
    if (!auth.currentUser) {
      // Wait a bit for auth to initialize
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.playerId = this.getPlayerId();
    this.connected = true;
    
    if (this.callbacks.onConnect) {
      this.callbacks.onConnect();
    }
  }

  disconnect() {
    if (this.roomRef) {
      // Clean up listeners
      off(this.roomRef);
      
      // Remove player from room
      if (this.roomId && this.playerId) {
        const playerRef = ref(database, `rooms/${this.roomId}/players/${this.playerId}`);
        remove(playerRef);
        
        // Check if room is empty and clean it up
        this.cleanupRoom();
      }
    }

    this.connected = false;
    this.roomId = null;
    this.playerNumber = null;
    this.playerId = null;
    this.roomRef = null;
    this.gameReadyTriggered = false; // Reset flag on disconnect

    if (this.callbacks.onDisconnect) {
      this.callbacks.onDisconnect();
    }
  }

  async cleanupRoom() {
    if (!this.roomId) return;

    const roomRef = ref(database, `rooms/${this.roomId}`);
    const snapshot = await get(ref(database, `rooms/${this.roomId}/players`));
    
    if (!snapshot.exists() || Object.keys(snapshot.val()).length === 0) {
      // Room is empty, remove it
      remove(roomRef);
    }
  }

  async createRoom(roomId) {
    if (!this.connected) {
      await this.connect();
    }

    const roomRef = ref(database, `rooms/${roomId}`);
    const snapshot = await get(roomRef);

    if (snapshot.exists()) {
      if (this.callbacks.onRoomError) {
        this.callbacks.onRoomError({ message: 'Room already exists' });
      }
      return;
    }

    // Create room with player 1
    await set(ref(database, `rooms/${roomId}`), {
      status: 'waiting',
      host: this.playerId,
      createdAt: Date.now()
    });

    await set(ref(database, `rooms/${roomId}/players/${this.playerId}`), {
      playerNumber: 1,
      connected: true,
      joinedAt: Date.now()
    });

    this.roomId = roomId;
    this.playerNumber = 1;
    this.roomRef = roomRef;

    // Set up room listeners
    this.setupRoomListeners();

    if (this.callbacks.onRoomCreated) {
      this.callbacks.onRoomCreated({ roomId, playerNumber: 1 });
    }
  }

  async joinRoom(roomId) {
    if (!this.connected) {
      await this.connect();
    }

    const roomRef = ref(database, `rooms/${roomId}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      if (this.callbacks.onRoomError) {
        this.callbacks.onRoomError({ message: 'Room does not exist' });
      }
      return;
    }

    // Check if room is full
    const playersSnapshot = await get(ref(database, `rooms/${roomId}/players`));
    if (playersSnapshot.exists() && Object.keys(playersSnapshot.val()).length >= 2) {
      if (this.callbacks.onRoomError) {
        this.callbacks.onRoomError({ message: 'Room is full' });
      }
      return;
    }

    // Add player 2
    await set(ref(database, `rooms/${roomId}/players/${this.playerId}`), {
      playerNumber: 2,
      connected: true,
      joinedAt: Date.now()
    });

    this.roomId = roomId;
    this.playerNumber = 2;
    this.roomRef = roomRef;

    // Set up room listeners BEFORE updating status
    this.setupRoomListeners();

    if (this.callbacks.onRoomJoined) {
      this.callbacks.onRoomJoined({ roomId, playerNumber: 2 });
    }

    // Wait a moment to ensure listeners are set up, then update status
    // The status change will trigger GameReady in setupRoomListeners
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Update room status to ready - this will trigger the listener in setupRoomListeners
    await update(ref(database, `rooms/${roomId}`), {
      status: 'ready'
    });
  }

  setupRoomListeners() {
    if (!this.roomRef) return;

    // Listen for room status changes and player connections
    onValue(ref(database, `rooms/${this.roomId}/status`), (snapshot) => {
      const status = snapshot.val();
      if (status === 'ready') {
        // Always check if both players are connected before starting game
        get(ref(database, `rooms/${this.roomId}/players`)).then((playersSnapshot) => {
          if (playersSnapshot.exists()) {
            const players = playersSnapshot.val();
            const playerCount = Object.keys(players).length;
            
            // Verify we have exactly 2 players and both are connected
            if (playerCount === 2 && !this.gameReadyTriggered) {
              const player1 = Object.values(players).find(p => p.playerNumber === 1);
              const player2 = Object.values(players).find(p => p.playerNumber === 2);
              
              if (player1 && player1.connected && player2 && player2.connected) {
                // Both players confirmed connected - trigger game ready (only once)
                this.gameReadyTriggered = true;
                if (this.callbacks.onGameReady) {
                  const playerIds = Object.keys(players);
                  this.callbacks.onGameReady({
                    player1: playerIds.find(id => players[id].playerNumber === 1),
                    player2: playerIds.find(id => players[id].playerNumber === 2)
                  });
                }
              }
            }
          }
        });
      }
    });

    // Listen for opponent paddle movements
    const opponentNumber = this.playerNumber === 1 ? 2 : 1;
    onValue(ref(database, `rooms/${this.roomId}/game/paddle${opponentNumber}`), (snapshot) => {
      const data = snapshot.val();
      if (data && this.callbacks.onOpponentPaddleMove) {
        this.callbacks.onOpponentPaddleMove({
          playerNumber: opponentNumber,
          x: data.x,
          direction: data.direction
        });
      }
    });

    // Listen for game state updates (ball position)
    onValue(ref(database, `rooms/${this.roomId}/game/ball`), (snapshot) => {
      const data = snapshot.val();
      if (data && this.callbacks.onGameStateSync) {
        this.callbacks.onGameStateSync({ ball: data });
      }
    });

    // Listen for score updates
    onValue(ref(database, `rooms/${this.roomId}/game/score`), (snapshot) => {
      const data = snapshot.val();
      if (data && this.callbacks.onScoreSync) {
        this.callbacks.onScoreSync(data);
      }
    });

    // Listen for game over
    onValue(ref(database, `rooms/${this.roomId}/game/gameOver`), (snapshot) => {
      const data = snapshot.val();
      if (data && this.callbacks.onGameOverSync) {
        this.callbacks.onGameOverSync(data);
      }
    });

    // Listen for game restart
    onValue(ref(database, `rooms/${this.roomId}/game/restart`), (snapshot) => {
      if (snapshot.val() && this.callbacks.onGameRestart) {
        this.callbacks.onGameRestart();
      }
    });

    // Listen for player connections/disconnections
    onValue(ref(database, `rooms/${this.roomId}/players`), (snapshot) => {
      if (snapshot.exists()) {
        const players = snapshot.val();
        const opponentNumber = this.playerNumber === 1 ? 2 : 1;
        const opponent = Object.values(players).find(p => p.playerNumber === opponentNumber);
        
        // Check if opponent disconnected
        if (!opponent || !opponent.connected) {
          if (this.callbacks.onOpponentDisconnected) {
            this.callbacks.onOpponentDisconnected();
          }
        }
        
        // Also check if both players are now connected and room is ready
        // This handles the case where status changes before player data is fully synced
        const playerCount = Object.keys(players).length;
        if (playerCount === 2) {
          const player1 = Object.values(players).find(p => p.playerNumber === 1);
          const player2 = Object.values(players).find(p => p.playerNumber === 2);
          
          if (player1 && player1.connected && player2 && player2.connected && !this.gameReadyTriggered) {
            // Check room status
            get(ref(database, `rooms/${this.roomId}/status`)).then((statusSnapshot) => {
              if (statusSnapshot.val() === 'ready' && !this.gameReadyTriggered) {
                // Both players confirmed connected and room is ready - trigger game ready (only once)
                this.gameReadyTriggered = true;
                if (this.callbacks.onGameReady) {
                  const playerIds = Object.keys(players);
                  this.callbacks.onGameReady({
                    player1: playerIds.find(id => players[id].playerNumber === 1),
                    player2: playerIds.find(id => players[id].playerNumber === 2)
                  });
                }
              }
            });
          }
        }
      }
    });
  }

  sendPaddleMove(x, direction) {
    if (!this.roomId || !this.playerNumber) return;

    const paddleRef = ref(database, `rooms/${this.roomId}/game/paddle${this.playerNumber}`);
    set(paddleRef, {
      x,
      direction,
      timestamp: Date.now()
    });
  }

  sendGameStateUpdate(gameState) {
    if (!this.roomId || !this.playerNumber) return;

    const ballRef = ref(database, `rooms/${this.roomId}/game/ball`);
    set(ballRef, {
      ...gameState.ball,
      timestamp: Date.now()
    });
  }

  sendScoreUpdate(score1, score2) {
    if (!this.roomId) return;

    const scoreRef = ref(database, `rooms/${this.roomId}/game/score`);
    set(scoreRef, {
      score1,
      score2,
      timestamp: Date.now()
    });
  }

  sendGameOver(winner) {
    if (!this.roomId) return;

    const gameOverRef = ref(database, `rooms/${this.roomId}/game/gameOver`);
    set(gameOverRef, {
      winner,
      timestamp: Date.now()
    });
  }

  sendRestartGame() {
    if (!this.roomId || this.playerNumber !== 1) return; // Only host can restart

    const restartRef = ref(database, `rooms/${this.roomId}/game/restart`);
    set(restartRef, Date.now());
    
    // Clear game over flag
    remove(ref(database, `rooms/${this.roomId}/game/gameOver`));
  }

  on(event, callback) {
    const callbackKey = `on${event.charAt(0).toUpperCase() + event.slice(1)}`;
    if (this.callbacks.hasOwnProperty(callbackKey)) {
      this.callbacks[callbackKey] = callback;
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
export default new FirebaseMultiplayer();

