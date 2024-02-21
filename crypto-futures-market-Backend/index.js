// server/server.js
import express from 'express';
import http from 'http';
import { Server } from "socket.io";// Import the WebSocket Server instance
import apiRoutes from './apis/apiRoutes.js';
import websocketRoutes from './websockets/wsRoutes.js';
import cors from 'cors';
import { setServerWebSocket } from './localStorage.js';
const io = new Server(5001);
setServerWebSocket(io);

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

// Modifying the console.log to print the data & time
const originalConsoleLog = console.log;

console.log = function () {
  const timestamp = new Date();
  const args = Array.from(arguments).map(arg => {
    return typeof arg === 'object' ? arg : arg;
  });
  originalConsoleLog(`[${timestamp}]`, ...args);
};
// Modifying the console.log to print the data & time

// API Routes
app.use('/api', apiRoutes);

// WebSocket Routes
io.on('connection', (socket) => {
    websocketRoutes(socket);  // Call websocketRoutes for each WebSocket connection
    console.log('Client connected');
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
