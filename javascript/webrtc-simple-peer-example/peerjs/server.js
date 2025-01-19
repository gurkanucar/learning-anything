const { PeerServer } = require('peer');

const peerServer = PeerServer({
    port: 9001,
    path: '/',
    allow_discovery: true
});

peerServer.on('connection', (client) => {
    console.log('Client connected:', client.id);
});

peerServer.on('disconnect', (client) => {
    console.log('Client disconnected:', client.id);
});

console.log('PeerJS server running on port 9001'); 