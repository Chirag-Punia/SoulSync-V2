import React, { useState, useEffect } from "react";
import { Card, CardBody, Progress, Button, Divider } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart,
  Activity,
  Brain,
  Calendar,
  MessageSquare,
  Heart,
} from "lucide-react";
import { GoogleFitService } from "../services/googleFitService";
import { FitbitService } from "../services/fitbitService";
import { toast } from "react-toastify";
import ExerciseTimer from "./ExerciseTimer";
import { getAuth } from "firebase/auth";

// Sample mood data
const sampleMoodData = [
  { date: "2024-02-01", mood: 7 },
  { date: "2024-02-02", mood: 6 },
  { date: "2024-02-03", mood: 8 },
  { date: "2024-02-04", mood: 5 },
  { date: "2024-02-05", mood: 9 },
];

function Dashboard() {
  const [moodData, setMoodData] = useState(sampleMoodData);
  const [stressLevel, setStressLevel] = useState(4);
  const [user, setUser] = useState();
  const [currentMood, setCurrentMood] = useState(5);
  const [weeklyGoalProgress, setWeeklyGoalProgress] = useState(60);
  const [showExerciseTimer, setShowExerciseTimer] = useState(false);
  const [isGoogleFitConnected, setIsGoogleFitConnected] = useState(false);
  const [isAppleHealthConnected, setIsAppleHealthConnected] = useState(false);
  const [isFitbitConnected, setIsFitbitConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigator = useNavigate();

  useEffect(() => {
    const initializeDashboard = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("No authenticated user");
        return;
      }

      try {
        const userInfoResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/`,
          {
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          }
        );
        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          setUser(userInfo);
          setLoading(false);
        }

        const userResponse = await GoogleFitService.getUserData();
        const userData = userResponse;
        setMoodData(userData.moodData || sampleMoodData);
        setStressLevel(userData.stressLevel || 4);
        setWeeklyGoalProgress(userData.weeklyGoalProgress || 0);

        if (userData.googleFitAccessToken) {
          setIsGoogleFitConnected(true);
        }
        const fitbitResponse = await FitbitService.fetchFitbitData();
        if (fitbitResponse.user) {
          setIsFitbitConnected(true);
        }
      } catch (error) {
        console.error("Error initializing dashboard:", error.message);
      }
    };

    initializeDashboard();
  }, []);

  const connectToGoogleFit = async () => {
    try {
      const authUrl = await GoogleFitService.getOAuthUrl();
      window.location.href = authUrl;

      await GoogleFitService.fetchGoogleFitData();
      setIsGoogleFitConnected(true);
      toast.success("Connected with Google Fit");
    } catch (error) {
      console.error("Error connecting to Google Fit:", error.message);
      toast.error("Failed to connect to Google Fit");
    }
  };

  const connectToAppleHealth = () => {
    alert("Apple Health integration requires iOS app development.");
    setIsAppleHealthConnected(true);
  };

  const connectToFitbit = async () => {
    try {
      const authUrl = await FitbitService.getOAuthUrl();
      window.location.href = authUrl;

      await FitbitService.fetchFitbitData();
      setIsFitbitConnected(true);
      toast.success("Fitbit data fetched and saved");
    } catch (error) {
      console.error("Error connecting to Fitbit:", error);
      toast.error("Failed to connect to Fitbit");
    }
  };

  const handleMoodInput = (event) => {
    setCurrentMood(parseInt(event.target.value, 10));
  };

  const startExercise = () => {
    setShowExerciseTimer(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b1e] to-[#2d1b4b] text-white p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Welcome Back, {!loading ? user.displayName : "User"}!
            </h1>
            <p className="text-gray-400 mt-2">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            size="lg"
            radius="full"
          >
            Start New Session
          </Button>
        </div>
      </div>

      {/* Health Platforms Section */}
      <Card className="bg-[#2a2b2e]/50 backdrop-blur-lg border border-gray-800 mb-8">
        <CardBody className="p-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Heart className="mr-2 text-pink-500" /> Health Integrations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Health Platform Cards with glassmorphism effect */}
            {[
              {
                name: "Google Fit",
                icon: "🏃‍♂️",
                color: "from-green-400 to-cyan-500",
                connected: isGoogleFitConnected,
                onPress: connectToGoogleFit,
              },
              {
                name: "Apple Health",
                icon: "❤️",
                color: "from-gray-500 to-gray-600",
                connected: isAppleHealthConnected,
                onPress: connectToAppleHealth,
              },
              {
                name: "Fitbit",
                icon: "⌚",
                color: "from-blue-400 to-indigo-500",
                connected: isFitbitConnected,
                onPress: connectToFitbit,
              },
            ].map((platform) => (
              <Card
                key={platform.name}
                className="bg-[#32333a]/30 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                isPressable
                onPress={platform.onPress}
              >
                <CardBody className="p-6">
                  <div className="text-3xl mb-4">{platform.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {platform.name}
                  </h3>
                  <Button
                    className={`
          mt-4 px-4 py-2 rounded-full text-sm font-medium w-full
          ${
            platform.connected
              ? "bg-green-500/20 text-green-400"
              : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
          }
        `}
                    isLoading={loading && !platform.connected}
                    onPress={(e) => {
                      e.preventDefault();
                      platform.onPress();
                    }}
                  >
                    {platform.connected ? "Connected" : "Connect"}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Mood Tracker */}
        <Card className="bg-[#2a2b2e]/50 backdrop-blur-lg border border-gray-800">
          <CardBody className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart className="mr-2 text-purple-500" /> Mood Analytics
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ stroke: "#8B5CF6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8, stroke: "#8B5CF6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Stress Level */}
        <Card className="bg-[#2a2b2e]/50 backdrop-blur-lg border border-gray-800">
          <CardBody className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="mr-2 text-orange-500" /> Stress Monitor
            </h3>
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-gray-700"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="96"
                    cy="96"
                  />
                  <circle
                    className="text-orange-500"
                    strokeWidth="12"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * stressLevel) / 10}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="96"
                    cy="96"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-orange-500">
                    {stressLevel}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value, 10))}
                className="w-[80%] accent-orange-500"
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Current Mood Section */}
      <Card className="bg-[#2a2b2e]/50 backdrop-blur-lg border border-gray-800 mb-8">
        <CardBody className="p-8">
          <h3 className="text-2xl font-semibold mb-6 flex items-center">
            <Brain className="mr-2 text-cyan-500" /> Current Mood
          </h3>
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full max-w-md">
              <input
                type="range"
                min="1"
                max="10"
                value={currentMood}
                onChange={handleMoodInput}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>Very Low</span>
                <span>Neutral</span>
                <span>Very High</span>
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-500"
              size="lg"
              radius="full"
              onPress={() => console.log("Mood logged:", currentMood)}
            >
              Log Current Mood
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Footer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Weekly Progress */}
        <Card className="bg-[#2a2b2e]/50 backdrop-blur-lg border border-gray-800">
          <CardBody className="p-6">
            <div className="flex items-center text-xl font-semibold mb-4">
              <Calendar className="mr-2 text-violet-500" /> Weekly Progress
            </div>
            <Progress
              value={weeklyGoalProgress}
              className="mb-4"
              classNames={{
                indicator: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
                track: "bg-gray-800",
              }}
            />
            <p className="text-gray-400 text-sm">
              {weeklyGoalProgress}% of weekly goals completed
            </p>
          </CardBody>
        </Card>

        {/* Mindfulness Exercise */}
        <Card className="bg-[#2a2b2e]/50 backdrop-blur-lg border border-gray-800">
          <CardBody className="p-6">
            <div className="flex items-center text-xl font-semibold mb-4">
              <Brain className="mr-2 text-pink-500" /> Daily Exercise
            </div>
            <ul className="space-y-2 mb-4 text-gray-400">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-2" />
                Breathing Exercise (5 min)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-2" />
                Meditation (10 min)
              </li>
            </ul>
            <Button
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500"
              onPress={startExercise}
            >
              Start Now
            </Button>
          </CardBody>
        </Card>

        {/* Support Groups */}
        <Card className="bg-[#2a2b2e]/50 backdrop-blur-lg border border-gray-800">
          <CardBody className="p-6">
            <div className="flex items-center text-xl font-semibold mb-4">
              <MessageSquare className="mr-2 text-emerald-500" /> Community
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">New messages</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-sm">
                  2 new
                </span>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500"
                onPress={() => {
                  navigator("/community");
                }}
              >
                View Messages
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {showExerciseTimer && (
        <ExerciseTimer onClose={() => setShowExerciseTimer(false)} />
      )}
    </div>
  );
}

export default Dashboard;
