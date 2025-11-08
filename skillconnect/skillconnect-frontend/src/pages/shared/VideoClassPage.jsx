import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideo, 
  FaVideoSlash, 
  FaDesktop,
  FaUserFriends,
  FaCommentDots,
  FaPhoneSlash,
  FaTimes
} from 'react-icons/fa';

const VideoClassPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');
  
  // Media & Peer State
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState({}); // { socketId: { connection: RTCPeerConnection, stream: MediaStream } }
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  
  // UI State
  const [showControls, setShowControls] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  
  // Refs
  const localVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peersRef = useRef({});
  const controlsTimeoutRef = useRef(null);
  const screenStreamRef = useRef(null);

  // ICE servers configuration
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // Initialize local media stream
  useEffect(() => {
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true
        });
        
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Could not access camera/microphone. Please check permissions.');
      }
    };

    initLocalStream();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize Socket.IO and WebRTC signaling
  useEffect(() => {
    if (!localStream || !roomId) return;

    // Connect to signaling server
    socketRef.current = io('http://localhost:3000', {
      auth: { token: localStorage.getItem('token') }
    });

    const socket = socketRef.current;

    // Join room
    socket.emit('join-room', { roomId });

    // Handle new user joining
    socket.on('user-joined', ({ socketId, participants: updatedParticipants }) => {
      console.log('User joined:', socketId);
      setParticipants(updatedParticipants);
      
      // Create peer connection for new user
      createPeerConnection(socketId, true);
    });

    // Handle receiving offer
    socket.on('offer', async ({ from, offer }) => {
      console.log('Received offer from:', from);
      const pc = createPeerConnection(from, false);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { to: from, answer });
    });

    // Handle receiving answer
    socket.on('answer', async ({ from, answer }) => {
      console.log('Received answer from:', from);
      const pc = peersRef.current[from]?.connection;
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // Handle ICE candidate
    socket.on('ice-candidate', async ({ from, candidate }) => {
      const pc = peersRef.current[from]?.connection;
      if (pc && candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Handle user leaving
    socket.on('user-left', ({ socketId, participants: updatedParticipants }) => {
      console.log('User left:', socketId);
      setParticipants(updatedParticipants);
      
      // Close and remove peer connection
      if (peersRef.current[socketId]) {
        peersRef.current[socketId].connection.close();
        delete peersRef.current[socketId];
        setPeers(prev => {
          const updated = { ...prev };
          delete updated[socketId];
          return updated;
        });
      }
    });

    // Handle active speaker detection
    socket.on('active-speaker', ({ socketId }) => {
      setActiveSpeaker(socketId);
    });

    // Handle chat messages
    socket.on('class-message', ({ from, message, timestamp }) => {
      setMessages(prev => [...prev, { from, message, timestamp }]);
    });

    // Handle participants list
    socket.on('participants-list', (participantsList) => {
      setParticipants(participantsList);
    });

    return () => {
      // Clean up all peer connections
      Object.values(peersRef.current).forEach(({ connection }) => {
        connection.close();
      });
      peersRef.current = {};
      
      // Disconnect socket
      if (socket) {
        socket.emit('leave-room', { roomId });
        socket.disconnect();
      }
    };
  }, [localStream, roomId]);

  // Create peer connection
  const createPeerConnection = (socketId, isInitiator) => {
    const pc = new RTCPeerConnection(iceServers);

    // Add local stream tracks to peer connection
    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });

    // Handle ICE candidate
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', {
          to: socketId,
          candidate: event.candidate
        });
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('Received remote track from:', socketId);
      const remoteStream = event.streams[0];
      
      setPeers(prev => ({
        ...prev,
        [socketId]: { connection: pc, stream: remoteStream }
      }));
      
      peersRef.current[socketId] = { connection: pc, stream: remoteStream };
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        // Attempt to reconnect
        console.log('Connection failed/disconnected for:', socketId);
      }
    };

    // If initiator, create and send offer
    if (isInitiator) {
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .then(() => {
          socketRef.current.emit('offer', {
            to: socketId,
            offer: pc.localDescription
          });
        })
        .catch(err => console.error('Error creating offer:', err));
    }

    peersRef.current[socketId] = { connection: pc, stream: null };
    return pc;
  };

  // Toggle mute
  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  // Share screen
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
      
      // Replace with camera stream
      const videoTrack = localStream.getVideoTracks()[0];
      Object.values(peersRef.current).forEach(({ connection }) => {
        const sender = connection.getSenders().find(s => s.track?.kind === 'video');
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      });
      
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false
        });
        
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];
        
        // Replace video track in all peer connections
        Object.values(peersRef.current).forEach(({ connection }) => {
          const sender = connection.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        });
        
        // Update local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        // Handle screen share stop
        screenTrack.onended = () => {
          toggleScreenShare();
        };
        
        setIsScreenSharing(true);
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    }
  };

  // Send chat message
  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        from: 'You',
        message: messageInput.trim(),
        timestamp: new Date().toISOString()
      };
      
      // Add message locally immediately
      setMessages(prev => [...prev, newMessage]);
      
      // Send via socket if connected
      if (socketRef.current) {
        socketRef.current.emit('class-message', {
          roomId,
          message: messageInput.trim()
        });
      }
      
      setMessageInput('');
    }
  };

  // End call
  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    navigate(-1);
  };

  // Handle mouse move for controls visibility
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Video Grid */}
      <div className={`h-screen p-4 transition-all duration-300 ${
        showParticipants && showChat ? 'pr-[600px]' :
        showParticipants || showChat ? 'pr-[320px]' : ''
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          {/* Local Video */}
          <div className="relative rounded-lg overflow-hidden bg-gray-800 shadow-inner">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-teal-600 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-white">You</span>
                  </div>
                  <p className="text-gray-300">Camera Off</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-gray-900/70 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-sm font-medium">You {isMuted && '(muted)'}</span>
            </div>
          </div>

          {/* Remote Videos */}
          {Object.entries(peers).map(([socketId, { stream }]) => (
            <div 
              key={socketId}
              className={`relative rounded-lg overflow-hidden bg-gray-800 shadow-inner ${
                activeSpeaker === socketId ? 'ring-2 ring-teal-500 animate-pulse' : ''
              }`}
            >
              <video
                autoPlay
                playsInline
                ref={(el) => {
                  if (el && stream) {
                    el.srcObject = stream;
                  }
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-gray-900/70 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">
                  {participants.find(p => p.socketId === socketId)?.name || 'Participant'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Controls Bar */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-full shadow-2xl px-6 py-4 flex items-center gap-4">
          {/* Mute/Unmute */}
          <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <FaMicrophoneSlash className="text-white text-lg" />
            ) : (
              <FaMicrophone className="text-white text-lg" />
            )}
          </button>

          {/* Video On/Off */}
          <button
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isVideoOff ? (
              <FaVideoSlash className="text-white text-lg" />
            ) : (
              <FaVideo className="text-white text-lg" />
            )}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isScreenSharing ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            <FaDesktop className="text-white text-lg" />
          </button>

          {/* Participants */}
          <button
            onClick={() => {
              setShowParticipants(!showParticipants);
              if (showChat && !showParticipants) setShowChat(false);
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              showParticipants ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Participants"
          >
            <FaUserFriends className="text-white text-lg" />
          </button>

          {/* Chat */}
          <button
            onClick={() => {
              setShowChat(!showChat);
              if (showParticipants && !showChat) setShowParticipants(false);
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              showChat ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Chat"
          >
            <FaCommentDots className="text-white text-lg" />
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-600 mx-2" />

          {/* End Call */}
          <button
            onClick={endCall}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
            title="End call"
          >
            <FaPhoneSlash className="text-white text-xl" />
          </button>
        </div>
      </div>

      {/* Participants Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-gray-800 border-l border-gray-700 transform transition-transform duration-300 ${
        showParticipants ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold text-lg">
            Participants ({participants.length + 1})
          </h3>
          <button
            onClick={() => setShowParticipants(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-64px)]">
          {/* Local user */}
          <div className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
              <span className="text-white font-medium">You</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">You</p>
              <p className="text-xs text-gray-400">Host</p>
            </div>
            {isMuted && <FaMicrophoneSlash className="text-red-500" />}
          </div>

          {/* Remote participants */}
          {participants.map((participant) => (
            <div key={participant.socketId} className="flex items-center gap-3 p-2 hover:bg-gray-700/30 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {participant.name?.charAt(0)?.toUpperCase() || 'P'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{participant.name || 'Participant'}</p>
                <p className="text-xs text-gray-400">{participant.role || 'Student'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-gray-800 border-l border-gray-700 transform transition-transform duration-300 flex flex-col ${
        showChat ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold text-lg">Chat</h3>
          <button
            onClick={() => setShowChat(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center text-sm mt-8">No messages yet</p>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-teal-400 text-sm font-medium">{msg.from}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-200 text-sm">{msg.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoClassPage;
