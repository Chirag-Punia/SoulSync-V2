import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { Copy, Check } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DAILY_API_URL = import.meta.env.VITE_DAILY_API_URL;
const DAILY_API_KEY = import.meta.env.VITE_DAILY_API_KEY;

const TherapyRoom = () => {
  const { roomId } = useParams();
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const frameRef = useRef(null);
  const isEveryoneLeft = useRef(false);

  const deleteRoom = async () => {
    try {
      await fetch(`${DAILY_API_URL}/rooms/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  useEffect(() => {
    const copyRoomId = async () => {
      try {
        await navigator.clipboard.writeText(roomId);
        setCopied(true);
        toast.success("Room ID copied to clipboard!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy room ID:", err);
        toast.error("Failed to copy room ID", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };

    copyRoomId();
  }, [roomId]);

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      toast.success("Room ID copied to clipboard!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy room ID:", err);
      toast.error("Failed to copy room ID", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    let frame;

    const initializeDaily = () => {
      const existingFrame = document.querySelector('iframe[title*="daily"]');
      if (existingFrame) return;

      frame = window.DailyIframe.createFrame({
        iframeStyle: {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "0",
          zIndex: 1,
        },
        showLeaveButton: true,
        showFullscreenButton: true,
      });

      frameRef.current = frame;

      frame.on("participant-joined", handleParticipantUpdate);
      frame.on("participant-left", handleParticipantUpdate);
      frame.on("left-meeting", handleLeftMeeting);

      frame
        .join({
          url: `https://${import.meta.env.VITE_APP_NAME}.daily.co/${roomId}`,
        })
        .catch((err) => {
          console.error("Failed to join Daily room:", err);
          setError("Failed to join session");
        });
    };

    const handleParticipantUpdate = async () => {
      try {
        const participants = await frame.participants();
        const participantCount = Object.keys(participants).length;

        if (participantCount === 0) {
          isEveryoneLeft.current = true;
          await deleteRoom();
          window.location.href = "/group-therapy";
        }
      } catch (error) {
        console.error("Error handling participant update:", error);
      }
    };

    const handleLeftMeeting = async () => {
      try {
        if (frameRef.current) {
          frameRef.current.destroy();
          frameRef.current = null;
        }

        if (isEveryoneLeft.current) {
          await deleteRoom();
        }

        window.location.href = "/group-therapy";
      } catch (error) {
        console.error("Error handling left meeting:", error);
        window.location.href = "/group-therapy";
      }
    };

    if (!window.DailyIframe) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@daily-co/daily-js";
      script.async = true;
      script.onload = initializeDaily;
      document.body.appendChild(script);
    } else {
      initializeDaily();
    }

    return () => {
      if (frameRef.current) {
        frameRef.current.destroy();
        frameRef.current = null;
      }
    };
  }, [roomId]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button
            color="primary"
            onPress={() => (window.location.href = "/group-therapy")}
          >
            Return to Sessions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background">
      <ToastContainer />

      <div className="absolute top-4 right-4 z-10">
        <Button
          isIconOnly
          color="primary"
          variant="light"
          onPress={handleCopyRoomId}
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
          aria-label="Copy room ID"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </Button>
      </div>

      <div id="daily-container" className="w-full h-full relative" />
    </div>
  );
};

export default TherapyRoom;
