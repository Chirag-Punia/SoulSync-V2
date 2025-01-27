// pages/TherapyRoom.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card } from "@nextui-org/react";
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaSignOutAlt,
  FaCopy,
} from "react-icons/fa";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Tooltip } from "@nextui-org/tooltip";
import { createAgoraClient } from "../services/agoraService";
import { toast } from "react-toastify";
import { auth } from "../services/firebaseConfig";
import { videoConfig, audioConfig } from "../services/agoraService";

const TherapyRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [users, setUsers] = useState([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const clientRef = useRef(null);
  const initialized = useRef(false);
  const isComponentMounted = useRef(true);

  // Copy Room ID functionality
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

  // Prevent accidental window/tab close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Main initialization effect
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Generate UID
        const uid = Math.floor(Math.random() * 1000000);

        // Get token
        const response = await fetch("http://localhost:5002/api/therapy/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
          },
          body: JSON.stringify({
            channelName: roomId,
            uid: uid,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get token");
        }

        const { token } = await response.json();

        // Create Agora client
        const agoraClient = createAgoraClient();
        clientRef.current = agoraClient;

        // Set up event handlers
        agoraClient.on("user-published", handleUserPublished);
        agoraClient.on("user-unpublished", handleUserUnpublished);
        agoraClient.on("user-left", handleUserLeft);
        agoraClient.on("connection-state-change", handleConnectionStateChange);

        // Join channel
        await agoraClient.join(
          import.meta.env.VITE_AGORA_APP_ID,
          roomId,
          token,
          uid
        );

        // Create local tracks
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
          {
            encoderConfig: "high_quality",
            AEC: true,
            ANS: true,
            AGC: true,
          },
          {
            encoderConfig: {
              width: { min: 640, ideal: 1920, max: 1920 },
              height: { min: 360, ideal: 1080, max: 1080 },
              frameRate: 30,
              bitrateMin: 400,
              bitrateMax: 4000,
            },
            facingMode: "user",
          }
        );

        if (isComponentMounted.current) {
          setLocalAudioTrack(audioTrack);
          setLocalVideoTrack(videoTrack);

          // Play local video
          videoTrack.play("local-video");

          // Publish tracks
          await agoraClient.publish([audioTrack, videoTrack]);
          
          setIsLoading(false);
          toast.success("Connected to session successfully!");
        }
      } catch (err) {
        console.error("Error initializing video call:", err);
        if (isComponentMounted.current) {
          setError(err.message);
          setIsLoading(false);
          toast.error("Failed to join session");
        }
      }
    };

    init();

    return () => {
      isComponentMounted.current = false;
      cleanup();
    };
  }, [roomId]);

  // Cleanup function
  const cleanup = async () => {
    try {
      if (localVideoTrack) {
        localVideoTrack.close();
      }
      if (localAudioTrack) {
        localAudioTrack.close();
      }
      if (clientRef.current) {
        clientRef.current.removeAllListeners();
        await clientRef.current.leave();
      }
    } catch (err) {
      console.error("Cleanup error:", err);
    }
  };

  // Event handlers
  const handleUserPublished = async (user, mediaType) => {
    try {
      if (!clientRef.current) {
        console.error("Client not initialized");
        return;
      }

      await clientRef.current.subscribe(user, mediaType);

      if (mediaType === "video") {
        user.videoTrack?.play(`remote-video-${user.uid}`);
      }
      if (mediaType === "audio") {
        user.audioTrack?.play();
      }

      setUsers((prev) => {
        const exists = prev.some((u) => u.uid === user.uid);
        if (exists) {
          return prev.map((u) => (u.uid === user.uid ? user : u));
        }
        return [...prev, user];
      });
    } catch (err) {
      console.error("Error subscribing to user:", err);
      toast.error("Failed to connect to a participant");
    }
  };

  const handleUserUnpublished = (user, mediaType) => {
    if (mediaType === "video") {
      user.videoTrack?.stop();
    }
    if (mediaType === "audio") {
      user.audioTrack?.stop();
    }
  };

  const handleUserLeft = (user) => {
    setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
  };

  const handleConnectionStateChange = (curState, prevState, reason) => {
    console.log(
      "Connection state changed:",
      prevState,
      "->",
      curState,
      "reason:",
      reason
    );
    if (curState === "DISCONNECTED") {
      toast.error("Connection lost. Trying to reconnect...");
    } else if (curState === "CONNECTED") {
      toast.success("Connected successfully!");
    }
  };

  // Media control functions
  const toggleVideo = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const leaveSession = async () => {
    try {
      await cleanup();
      navigate("/group-therapy");
    } catch (err) {
      console.error("Error leaving session:", err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Error state
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

  // Main render
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Room ID display */}
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

      {/* Video grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Local user video */}
        <Card className="relative aspect-video bg-black">
          <div id="local-video" className="w-full h-full"></div>
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
            You
          </div>
        </Card>

        {/* Remote users video */}
        {users.map((user) => (
          <Card key={user.uid} className="relative aspect-video bg-black">
            <div
              id={`remote-video-${user.uid}`}
              className="w-full h-full"
            ></div>
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
              Participant {user.uid}
            </div>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        <Button
          isIconOnly
          className={`rounded-full p-4 ${
            isVideoEnabled ? "bg-purple-600" : "bg-red-600"
          }`}
          onPress={toggleVideo}
        >
          {isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
        </Button>
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
