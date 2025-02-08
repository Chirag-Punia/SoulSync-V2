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
  Divider,
} from "@nextui-org/react";
import { createDailyRoom } from "../services/dailyService";
import {
  FaUsers,
  FaVideo,
  FaPaste,
  FaLock,
  FaUserFriends,
  FaHeadset,
} from "react-icons/fa";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Card className="p-4 border-none bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg">
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  </Card>
);

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
      console.error("Failed to paste from clipboard");
    }
  };

  const createSession = async () => {
    setIsCreating(true);
    try {
      const roomId = await createDailyRoom();
      setIsHost(true);
      navigate(`/group-therapy/${roomId}`);
    } catch (error) {
      console.error("Failed to create room");
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
    <div className="h-[40rem] mx-auto bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 ">
        <div className="text-center mb-16 pt-4">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-white bg-clip-text text-transparent">
            Virtual Group Therapy
          </h1>

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300 mb-1">
                1000+
              </div>
              <div className="text-sm text-gray-400">Active Sessions</div>
            </div>
            <Divider
              orientation="vertical"
              className="h-12 bg-gray-700 hidden md:block"
            />
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-300 mb-1">50k+</div>
              <div className="text-sm text-gray-400">Members</div>
            </div>
            <Divider
              orientation="vertical"
              className="h-12 bg-gray-700 hidden md:block"
            />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300 mb-1">95%</div>
              <div className="text-sm text-gray-400">Satisfaction</div>
            </div>
          </div>

          <Card className="max-w-md mx-auto bg-background/10 backdrop-blur-xl border border-white/10">
            <div className="p-8">
              <Button
                className="w-full mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
                onPress={createSession}
                size="lg"
                startContent={
                  isCreating ? null : <FaVideo className="w-5 h-5" />
                }
                isLoading={isCreating}
                spinner={<Spinner color="white" size="sm" />}
                isDisabled={isCreating}
              >
                {isCreating ? "Creating Your Session..." : "Start New Session"}
              </Button>

              <div className="relative my-6">
                <Divider className="bg-gray-700" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-background/10 backdrop-blur-xl">
                  <span className="text-gray-400">or</span>
                </div>
              </div>

              <Button
                variant="bordered"
                onPress={() => setShowJoinModal(true)}
                size="lg"
                className="w-full border-gray-700 hover:bg-white/5"
                startContent={<FaUsers className="w-5 h-5" />}
                isDisabled={isCreating}
              >
                Join Existing Session
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={FaLock}
            title="Secure & Private"
            description="End-to-end encrypted sessions ensuring your privacy and confidentiality"
          />
          <FeatureCard
            icon={FaUserFriends}
            title="Group Support"
            description="Connect with others facing similar challenges in a supportive environment"
          />
          <FeatureCard
            icon={FaHeadset}
            title="HD Quality"
            description="Crystal clear audio and video for an immersive therapy experience"
          />
        </div>
      </div>

      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        backdrop="blur"
        classNames={{
          base: "bg-background/60 backdrop-blur-xl border border-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Join Therapy Session
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-2">
                  <Input
                    label="Session ID"
                    variant="bordered"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter your session ID"
                    className="flex-1"
                    classNames={{
                      input: "bg-transparent",
                    }}
                  />
                  <Button
                    isIconOnly
                    variant="flat"
                    onPress={handlePaste}
                    className="self-end bg-gradient-to-r from-purple-500/20 to-pink-500/20"
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
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  onPress={() => {
                    joinSession();
                    onClose();
                  }}
                  isDisabled={!roomId.trim()}
                >
                  Join Session
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
