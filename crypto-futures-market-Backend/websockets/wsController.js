// // server/websockets/websocketController.js
// import { WebSocketServer } from 'ws';

// const server = new WebSocketServer({ port: 5000 });
// const clients = new Set();

// server.on('connection', (ws) => {
//   console.log('Client connected');
//   clients.add(ws);

//   ws.on('close', () => {
//     console.log('Client disconnected');
//     clients.delete(ws);
//   });
// });

// // Function to broadcast a message to all connected clients
// const broadcastMessage = (message) => {
//   clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(message);
//     }
//   });
// };

// export { server as wss, broadcastMessage };
