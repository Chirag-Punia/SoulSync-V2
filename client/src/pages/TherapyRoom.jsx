import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card } from "@nextui-org/react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaSignOutAlt,
  FaCopy,
} from "react-icons/fa";
import { Tooltip } from "@nextui-org/tooltip";
import { toast } from "react-toastify";
import { auth } from "../services/firebaseConfig";

const TherapyRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef();
  const peerConnectionsRef = useRef({});
  const localStreamRef = useRef(null);

  const [participants, setParticipants] = useState(new Map());
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setIsCopied(true);
      toast.success("Room ID copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy Room ID");
    }
  };

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        localStreamRef.current = stream;
        setIsAudioEnabled(true);

        setupSocketHandlers();

        joinRoom();

        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing room:", err);
        setError("Failed to access microphone. Please check permissions.");
        setIsLoading(false);
      }
    };

    initializeRoom();

    return () => {
      cleanup();
    };
  }, [roomId]);

  const setupSocketHandlers = () => {
    /*
    socketRef.current.on('userJoined', handleUserJoined);
    socketRef.current.on('userLeft', handleUserLeft);
    socketRef.current.on('offer', handleOffer);
    socketRef.current.on('answer', handleAnswer);
    socketRef.current.on('iceCandidate', handleIceCandidate);
    */
  };

  const joinRoom = async () => {
    /*
    socketRef.current.emit('joinRoom', {
      roomId,
      userId: auth.currentUser.uid
    });
    */
  };

  const createPeerConnection = (userId) => {
    /*
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },

      ]
    });
    

    localStreamRef.current.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStreamRef.current);
    });


    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('iceCandidate', {
          candidate: event.candidate,
          to: userId
        });
      }
    };


    peerConnection.ontrack = (event) => {

    };

    peerConnectionsRef.current[userId] = peerConnection;
    return peerConnection;
    */
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);

      /*
      socketRef.current.emit('audioStateChange', {
        roomId,
        enabled: audioTrack.enabled
      });
      */
    }
  };

  const leaveSession = async () => {
    cleanup();
    navigate("/group-therapy");
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
    peerConnectionsRef.current = {};

    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button color="primary" onPress={() => navigate("/group-therapy")}>
            Return to Sessions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Participants ({participants.size + 1})
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>You {isAudioEnabled ? "(🎤 on)" : "(🎤 off)"}</span>
          </div>

          {Array.from(participants.values()).map((participant) => (
            <div key={participant.id} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>
                Participant {participant.id}
                {participant.isAudioEnabled ? "(🎤 on)" : "(🎤 off)"}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-center items-center mb-6">
        <div className="bg-background/60 backdrop-blur-lg border border-white/20 rounded-lg px-4 py-2 flex items-center gap-2">
          <span className="text-sm">Room ID: {roomId}</span>
          <Tooltip content={isCopied ? "Copied!" : "Copy Room ID"}>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={copyRoomId}
              className="text-purple-500"
            >
              <FaCopy />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        <Button
          isIconOnly
          className={`rounded-full p-4 ${
            isAudioEnabled ? "bg-purple-600" : "bg-red-600"
          }`}
          onPress={toggleAudio}
        >
          {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </Button>
        <Button
          isIconOnly
          className="rounded-full p-4 bg-red-600"
          onPress={leaveSession}
        >
          <FaSignOutAlt />
        </Button>
      </div>
    </div>
  );
};

export default TherapyRoom;
