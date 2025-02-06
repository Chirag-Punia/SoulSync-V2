import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@nextui-org/react";
import { createDailyRoom } from "../services/dailyService";
import { FaUsers, FaVideo, FaPaste } from "react-icons/fa";

const GroupTherapy = () => {
  const [isHost, setIsHost] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRoomId(text);
    } catch (err) {
      toast.error("Failed to paste from clipboard");
    }
  };

  const createSession = async () => {
    setIsCreating(true);
    try {
      const roomId = await createDailyRoom();
      setIsHost(true);
      navigate(`/group-therapy/${roomId}`);
    } catch (error) {
      toast.error("Failed to create room");
      setIsCreating(false);
    }
  };

  const joinSession = () => {
    if (roomId) {
      setIsHost(false);
      navigate(`/group-therapy/${roomId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Group Therapy Sessions
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create or join a therapy session with video and voice communication
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-md mx-auto">
        <Card className="p-6 bg-background/60 backdrop-blur-lg border border-white/20">
          <div className="flex flex-col gap-4">
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              onPress={createSession}
              size="lg"
              startContent={isCreating ? null : <FaVideo />}
              isLoading={isCreating}
              spinner={
                <Spinner 
                  color="white" 
                  size="sm"
                />
              }
              isDisabled={isCreating}
            >
              {isCreating ? "Creating Session..." : "Create New Session"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                  or
                </span>
              </div>
            </div>

            <Button
              variant="bordered"
              onPress={() => setShowJoinModal(true)}
              size="lg"
              startContent={<FaUsers />}
              isDisabled={isCreating}
            >
              Join Existing Session
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Join Session
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-2">
                  <Input
                    label="Room ID"
                    variant="bordered"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter room ID"
                    className="flex-1"
                  />
                  <Button
                    isIconOnly
                    variant="flat"
                    onPress={handlePaste}
                    className="self-end"
                  >
                    <FaPaste />
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  onPress={() => {
                    joinSession();
                    onClose();
                  }}
                  isDisabled={!roomId.trim()}
                >
                  Join
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupTherapy;