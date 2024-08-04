const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
    clients.push(ws);

    ws.on('message', (message) => {
        // Ensure the message is a string and parse it
        try {
            const parsedMessage = JSON.parse(message);

            // Broadcast the message to all clients
            clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(parsedMessage));
                }
            });
        } catch (error) {
            console.error('Failed to parse message:', error);
        }
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
