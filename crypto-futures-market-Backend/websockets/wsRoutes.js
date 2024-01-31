// server/websockets/websocketRoutes.js

const websocketRoutes = (ws) => {
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Send the received message back to the client
    ws.emit(`Server: ${message}`);
    
    // Broadcasting a message to all connected clients
    broadcastMessage(`Broadcast: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
};

export default websocketRoutes;
