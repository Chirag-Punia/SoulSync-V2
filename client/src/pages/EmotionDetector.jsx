import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Card,
  Progress,
  Tooltip,
} from "@nextui-org/react";
import {
  FaCamera,
  FaTimes,
  FaSmile,
  FaHistory,
  FaBrain,
  FaChartLine,
  FaLightbulb,
} from "react-icons/fa";
import { MdFaceRetouchingNatural, MdTimeline, MdMood } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const EmotionDetector = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFeatures, setShowFeatures] = useState(true);

  const FACE_API_KEY = import.meta.env.VITE_FACE_API_KEY;
  const FACE_API_SECRET = import.meta.env.VITE_FACE_API_SECRET;
  const features = [
    {
      icon: <FaBrain className="text-4xl text-purple-400" />,
      title: "AI-Powered Analysis",
      description:
        "Advanced facial recognition and emotion detection using Face++ API",
    },
    {
      icon: <MdTimeline className="text-4xl text-blue-400" />,
      title: "Emotion Tracking",
      description:
        "Track your emotional patterns over time with detailed history",
    },
    {
      icon: <FaLightbulb className="text-4xl text-yellow-400" />,
      title: "Smart Recommendations",
      description: "Get personalized suggestions based on your emotional state",
    },
    {
      icon: <MdMood className="text-4xl text-green-400" />,
      title: "Multiple Emotions",
      description:
        "Detect various emotions including happiness, sadness, anger, and more",
    },
  ];
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeEmotion = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const base64Data = selectedImage.split(",")[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(
        (res) => res.blob()
      );

      const formData = new FormData();
      formData.append("api_key", FACE_API_KEY);
      formData.append("api_secret", FACE_API_SECRET);
      formData.append("image_file", blob, "image.jpg");
      formData.append("return_attributes", "emotion");

      const response = await axios.post(
        "https://api-us.faceplusplus.com/facepp/v3/detect",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.faces && response.data.faces.length > 0) {
        const emotions = response.data.faces[0].attributes.emotion;
        const dominantEmotion = Object.entries(emotions).reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0];

        setEmotion({
          dominant: dominantEmotion,
          details: emotions,
        });

        // Store emotion history
        const emotionHistory = JSON.parse(
          localStorage.getItem("emotionHistory") || "[]"
        );
        emotionHistory.push({
          emotion: dominantEmotion,
          timestamp: new Date().toISOString(),
          details: emotions,
        });
        localStorage.setItem(
          "emotionHistory",
          JSON.stringify(emotionHistory.slice(-10))
        ); // Keep last 10 entries

        toast.success(`Detected emotion: ${dominantEmotion}`);
      } else {
        throw new Error("No face detected");
      }
    } catch (error) {
      console.error("Error analyzing emotion:", error);
      toast.error("Failed to analyze emotion. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEmotionColor = (emotionName) => {
    const colors = {
      happiness: "text-yellow-500",
      sadness: "text-blue-500",
      anger: "text-red-500",
      disgust: "text-green-500",
      fear: "text-purple-500",
      surprise: "text-pink-500",
      neutral: "text-gray-500",
    };
    return colors[emotionName.toLowerCase()] || "text-white";
  };
  const getEmotionRecommendation = (emotion) => {
    const recommendations = {
      happiness: "Great mood! Consider sharing your positivity with others.",
      sadness:
        "Take some time for self-care. Maybe try some calming meditation?",
      anger: "Try deep breathing exercises to help calm down.",
      fear: "Remember you're safe. Practice grounding techniques.",
      surprise: "Take a moment to process your emotions.",
      disgust: "Focus on positive aspects around you.",
      neutral: "Good time for mindfulness practice.",
    };
    return (
      recommendations[emotion.toLowerCase()] || "Take care of yourself today."
    );
  };
  const resetModal = () => {
    setSelectedImage(null);
    setEmotion(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8">
      {/* Main Controls */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Emotion Detection
            </h2>
            <p className="text-gray-400">
              Analyze your emotions with advanced AI technology
            </p>
          </div>
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                startContent={<MdFaceRetouchingNatural size={24} />}
                onPress={() => {
                  resetModal();
                  onOpen();
                }}
                size="lg"
              >
                Detect Emotion
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                startContent={<FaHistory size={20} />}
                onPress={() => setShowHistory(true)}
                size="lg"
              >
                History
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>

      {/* Features Showcase */}
      {showFeatures && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/10 hover:border-purple-500/50 transition-all">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Detection Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          resetModal();
        }}
        size="4xl"
        classNames={{
          base: "bg-gradient-to-br from-[#1a1b1e] to-[#2d1b4b] border border-white/10",
          header: "border-b border-white/10",
          body: "py-6",
          footer: "border-t border-white/10",
        }}
      >
        // ... previous imports and code remain same ...
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Emotion Analysis
            </h2>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload/Image Section */}
              <div className="space-y-4 max-h-[500px] overflow-hidden">
                {!selectedImage ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center h-full flex items-center justify-center"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-6 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                          <FaCamera className="text-5xl text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">
                          Upload Your Photo
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Take or upload a photo to analyze your emotion
                        </p>
                        <div className="flex space-x-2 text-xs">
                          <span className="px-2 py-1 bg-gray-800 rounded">
                            JPG
                          </span>
                          <span className="px-2 py-1 bg-gray-800 rounded">
                            PNG
                          </span>
                        </div>
                      </div>
                    </label>
                  </motion.div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden h-full">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-full h-[400px] object-contain bg-black/40"
                    />
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/20" />
                    <Button
                      isIconOnly
                      className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
                      onPress={() => setSelectedImage(null)}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                )}
              </div>

              {/* Analysis Section */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {!emotion && selectedImage && (
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                    onPress={analyzeEmotion}
                    isLoading={isAnalyzing}
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Emotion"}
                  </Button>
                )}

                {emotion && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Summary Card */}
                    <Card className="bg-white/5 p-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                          <FaSmile
                            className={`text-4xl ${getEmotionColor(
                              emotion.dominant
                            )}`}
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {emotion.dominant}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1">
                            {getEmotionRecommendation(emotion.dominant)}
                          </p>
                        </div>
                      </div>

                      {/* Emotion Details */}
                      <div className="space-y-4">
                        {Object.entries(emotion.details)
                          .sort(([, a], [, b]) => b - a) // Sort by value descending
                          .map(([emo, value]) => (
                            <Tooltip
                              key={emo}
                              content={`${emo}: ${value.toFixed(1)}%`}
                              placement="right"
                            >
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-2">
                                    <span
                                      className={`w-2 h-2 rounded-full ${getEmotionColor(
                                        emo
                                      ).replace("text-", "bg-")}`}
                                    />
                                    <span className="text-gray-300 capitalize">
                                      {emo}
                                    </span>
                                  </div>
                                  <span
                                    className={`${getEmotionColor(
                                      emo
                                    )} font-medium`}
                                  >
                                    {value.toFixed(1)}%
                                  </span>
                                </div>
                                <Progress
                                  value={value}
                                  className="h-2"
                                  classNames={{
                                    indicator: `${getEmotionColor(emo).replace(
                                      "text-",
                                      "bg-"
                                    )} transition-all duration-500`,
                                    track: "bg-gray-800/40",
                                  }}
                                />
                              </div>
                            </Tooltip>
                          ))}
                      </div>
                    </Card>

                    {/* Recommendations Card */}
                    <Card className="bg-white/5 p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Recommendations
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <FaLightbulb className="text-yellow-400 mt-1" />
                          <p className="text-gray-300 text-sm">
                            {getEmotionRecommendation(emotion.dominant)}
                          </p>
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-white/10"
                          onPress={() => {
                            resetModal();
                            onOpen();
                          }}
                        >
                          Try Another Photo
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        size="2xl"
        classNames={{
          base: "bg-gradient-to-br from-[#1a1b1e] to-[#2d1b4b] border border-white/10",
        }}
      >
        <ModalContent>
          <ModalHeader>Emotion History</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {JSON.parse(localStorage.getItem("emotionHistory") || "[]")
                .reverse()
                .map((entry, index) => (
                  <Card key={index} className="bg-white/5 p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4
                          className={`text-lg font-semibold ${getEmotionColor(
                            entry.emotion
                          )}`}
                        >
                          {entry.emotion}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <FaSmile
                        className={`text-2xl ${getEmotionColor(entry.emotion)}`}
                      />
                    </div>
                  </Card>
                ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setShowHistory(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EmotionDetector;
