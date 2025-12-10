const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Game rooms storage
const rooms = new Map();
const players = new Map();

// Game state for each room
const gameStates = new Map();

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('createRoom', (roomId) => {
    if (rooms.has(roomId)) {
      socket.emit('roomError', { message: 'Room already exists' });
      return;
    }

    rooms.set(roomId, {
      id: roomId,
      players: [socket.id],
      host: socket.id,
      status: 'waiting'
    });

    players.set(socket.id, {
      roomId: roomId,
      playerNumber: 1
    });

    socket.join(roomId);
    socket.emit('roomCreated', { roomId, playerNumber: 1 });
    console.log(`Room ${roomId} created by ${socket.id}`);
  });

  socket.on('joinRoom', (roomId) => {
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('roomError', { message: 'Room does not exist' });
      return;
    }

    if (room.players.length >= 2) {
      socket.emit('roomError', { message: 'Room is full' });
      return;
    }

    room.players.push(socket.id);
    room.status = 'ready';
    
    players.set(socket.id, {
      roomId: roomId,
      playerNumber: 2
    });

    socket.join(roomId);
    socket.emit('roomJoined', { roomId, playerNumber: 2 });
    
    // Notify both players that game can start
    io.to(roomId).emit('gameReady', {
      player1: room.players[0],
      player2: room.players[1]
    });

    console.log(`Player ${socket.id} joined room ${roomId}`);
  });

  socket.on('paddleMove', (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const roomId = player.roomId;
    const room = rooms.get(roomId);
    if (!room) return;

    // Broadcast paddle movement to other player
    socket.to(roomId).emit('opponentPaddleMove', {
      playerNumber: player.playerNumber,
      x: data.x,
      direction: data.direction
    });
  });

  socket.on('gameStateUpdate', (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const roomId = player.roomId;
    
    // Store game state (authoritative server can validate if needed)
    gameStates.set(roomId, {
      ...data,
      lastUpdate: Date.now(),
      updatedBy: socket.id
    });

    // Broadcast to other player
    socket.to(roomId).emit('gameStateSync', data);
  });

  socket.on('scoreUpdate', (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const roomId = player.roomId;
    
    // Broadcast score update to both players
    io.to(roomId).emit('scoreSync', data);
  });

  socket.on('gameOver', (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const roomId = player.roomId;
    
    // Broadcast game over to both players
    io.to(roomId).emit('gameOverSync', data);
  });

  socket.on('restartGame', () => {
    const player = players.get(socket.id);
    if (!player) return;

    const roomId = player.roomId;
    const room = rooms.get(roomId);
    if (!room) return;

    // Only host can restart
    if (room.host === socket.id) {
      io.to(roomId).emit('gameRestart');
    }
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    
    const player = players.get(socket.id);
    if (player) {
      const roomId = player.roomId;
      const room = rooms.get(roomId);
      
      if (room) {
        // Notify other player
        socket.to(roomId).emit('opponentDisconnected');
        
        // Clean up room if empty
        room.players = room.players.filter(id => id !== socket.id);
        if (room.players.length === 0) {
          rooms.delete(roomId);
          gameStates.delete(roomId);
        } else {
          // Transfer host if needed
          if (room.host === socket.id && room.players.length > 0) {
            room.host = room.players[0];
          }
        }
      }
      
      players.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

