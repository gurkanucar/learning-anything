let peer = null;
let localStream = null;
let ws = null;
let userId = null;
let isConnected = false;

// Track media states
let isVideoEnabled = true;
let isAudioEnabled = true;

function initializeWebSocket() {
    ws = new WebSocket('ws://localhost:8080');

    // WebSocket event handlers
    ws.onmessage = async (event) => {
        const message = JSON.parse(event.data);

        switch (message.type) {
            case 'joined':
                userId = message.userId;
                console.log('Joined room with ID:', userId);
                
                // Initialize local stream if not already done
                if (!localStream) {
                    try {
                        localStream = await navigator.mediaDevices.getUserMedia({ 
                            video: true, 
                            audio: true 
                        });
                        document.getElementById('localVideo').srcObject = localStream;
                    } catch (err) {
                        console.error('Error accessing media devices:', err);
                    }
                }

                // Initialize PeerJS connection
                initializePeerJS();

                isConnected = true;
                updateConnectionStatus(true);

                // Connect to existing peers
                message.peers.forEach(peerId => {
                    connectToPeer(peerId);
                });
                break;

            case 'peer-joined':
                // New peer joined, they will initiate the connection
                console.log('New peer joined:', message.peerId);
                break;

            case 'peer-left':
                console.log('Peer left:', message.peerId);
                break;
        }
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
        isConnected = false;
        updateConnectionStatus(false);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        isConnected = false;
        updateConnectionStatus(false);
    };

    return ws;
}

function initializePeerJS() {
    // Initialize PeerJS
    peer = new Peer(userId, {
        host: 'localhost',
        port: 9001,
        path: '/',
        debug: 3
    });

    peer.on('open', (id) => {
        console.log('Connected to PeerJS server with ID:', id);
    });

    peer.on('call', (call) => {
        // Answer incoming call
        call.answer(localStream);
        handleCall(call);
    });

    peer.on('error', (error) => {
        console.error('PeerJS error:', error);
    });
}

function connectToPeer(peerId) {
    if (!peer || !localStream) return;

    console.log('Calling peer:', peerId);
    const call = peer.call(peerId, localStream);
    handleCall(call);
}

function handleCall(call) {
    call.on('stream', (remoteStream) => {
        console.log('Received remote stream');
        document.getElementById('remoteVideo').srcObject = remoteStream;
    });

    call.on('close', () => {
        console.log('Call closed');
        document.getElementById('remoteVideo').srcObject = null;
    });

    call.on('error', (error) => {
        console.error('Call error:', error);
    });
}

function joinRoom() {
    const roomId = document.getElementById('roomId').value;
    if (roomId.trim()) {
        if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
            ws = initializeWebSocket();
            
            ws.onopen = () => {
                ws.send(JSON.stringify({
                    type: 'join',
                    room: roomId
                }));
            };
        } else {
            ws.send(JSON.stringify({
                type: 'join',
                room: roomId
            }));
        }
    }
}

function leaveRoom() {
    if (isConnected) {
        if (peer) {
            peer.destroy();
            peer = null;
        }
        
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            localStream = null;
            document.getElementById('localVideo').srcObject = null;
        }

        document.getElementById('remoteVideo').srcObject = null;
        
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'leave' }));
            ws.close();
        }
        
        isConnected = false;
        updateConnectionStatus(false);
        updateMediaButtons();
    }
}

function toggleVideo() {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            isVideoEnabled = !isVideoEnabled;
            videoTrack.enabled = isVideoEnabled;
            updateMediaButtons();
        }
    }
}

function toggleAudio() {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            isAudioEnabled = !isAudioEnabled;
            audioTrack.enabled = isAudioEnabled;
            updateMediaButtons();
        }
    }
}

// Add window unload handler to clean up
window.addEventListener('beforeunload', () => {
    leaveRoom();
});

// Update UI elements based on connection state
function updateConnectionStatus(connected) {
    const statusIndicator = document.getElementById('statusIndicator');
    const connectionStatus = document.getElementById('connectionStatus');
    const joinBtn = document.getElementById('joinBtn');
    const leaveBtn = document.getElementById('leaveBtn');

    if (connected) {
        statusIndicator.className = 'status-indicator status-connected';
        connectionStatus.textContent = 'Connected';
        joinBtn.disabled = true;
        leaveBtn.disabled = false;
    } else {
        statusIndicator.className = 'status-indicator status-disconnected';
        connectionStatus.textContent = 'Disconnected';
        joinBtn.disabled = false;
        leaveBtn.disabled = true;
    }
}

// Update video/audio button states
function updateMediaButtons() {
    const videoBtn = document.getElementById('videoBtn');
    const audioBtn = document.getElementById('audioBtn');

    if (isVideoEnabled) {
        videoBtn.innerHTML = '<i class="fas fa-video"></i> Video';
        videoBtn.classList.remove('video-off');
    } else {
        videoBtn.innerHTML = '<i class="fas fa-video-slash"></i> Video Off';
        videoBtn.classList.add('video-off');
    }

    if (isAudioEnabled) {
        audioBtn.innerHTML = '<i class="fas fa-microphone"></i> Audio';
        audioBtn.classList.remove('audio-off');
    } else {
        audioBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Audio Off';
        audioBtn.classList.add('audio-off');
    }
}

// Initialize WebSocket on page load
initializeWebSocket();

// Initialize UI
updateConnectionStatus(false);
updateMediaButtons(); 