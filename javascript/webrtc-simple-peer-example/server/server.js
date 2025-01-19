const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

// Store active rooms and their participants
const rooms = new Map();

server.on('connection', (ws) => {
    let currentRoom = null;
    let userId = null;

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        switch (data.type) {
            case 'join':
                // Generate a random user ID if not provided
                userId = data.userId || Math.random().toString(36).substr(2, 9);
                currentRoom = data.room;

                // Create room if it doesn't exist
                if (!rooms.has(currentRoom)) {
                    rooms.set(currentRoom, new Map());
                }

                // Add user to room
                rooms.get(currentRoom).set(userId, ws);

                // Notify user of their ID and other peers in the room
                ws.send(JSON.stringify({
                    type: 'joined',
                    userId: userId,
                    peers: Array.from(rooms.get(currentRoom).keys()).filter(id => id !== userId)
                }));

                // Notify other peers about new user
                broadcastToRoom(currentRoom, {
                    type: 'peer-joined',
                    peerId: userId
                }, userId);
                break;

            case 'signal':
                // Forward signaling data to specific peer
                const targetPeer = rooms.get(currentRoom)?.get(data.target);
                if (targetPeer) {
                    targetPeer.send(JSON.stringify({
                        type: 'signal',
                        from: userId,
                        data: data.signal
                    }));
                }
                break;

            case 'leave':
                handleUserDisconnection();
                break;
        }
    });

    ws.on('close', () => {
        handleUserDisconnection();
    });

    function handleUserDisconnection() {
        if (currentRoom && userId) {
            // Remove user from room
            rooms.get(currentRoom)?.delete(userId);
            
            // Delete room if empty
            if (rooms.get(currentRoom)?.size === 0) {
                rooms.delete(currentRoom);
            } else {
                // Notify others about peer disconnection
                broadcastToRoom(currentRoom, {
                    type: 'peer-left',
                    peerId: userId
                }, userId);
            }
            
            currentRoom = null;
            userId = null;
        }
    }

    function broadcastToRoom(room, message, excludeUserId) {
        const roomParticipants = rooms.get(room);
        if (roomParticipants) {
            roomParticipants.forEach((peer, id) => {
                if (id !== excludeUserId) {
                    peer.send(JSON.stringify(message));
                }
            });
        }
    }
});

console.log('WebSocket server running on port 8080'); 