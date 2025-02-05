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
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [showMoodHistory, setShowMoodHistory] = useState(false);
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
          setIsSubscribed(userInfo.isSubscribedToAffirmations);
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

        const moodHistoryResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/moods/history`,
          {
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          }
        );
        if (moodHistoryResponse.ok) {
          const history = await moodHistoryResponse.json();
          setMoodHistory(history);
          setMoodData(history);
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

  const logMood = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("Please sign in to log mood");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/moods/log`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mood: currentMood,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        toast.success("Mood logged successfully!");
        const historyResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/moods/history`,
          {
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          }
        );
        if (historyResponse.ok) {
          const history = await historyResponse.json();
          setMoodHistory(history);
          setMoodData(history);
        }
      } else {
        throw new Error("Failed to log mood");
      }
    } catch (error) {
      console.error("Error logging mood:", error);
      toast.error("Failed to log mood");
    }
  };

  const startExercise = () => {
    setShowExerciseTimer(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b1e] to-[#2d1b4b] text-white p-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold w-full sm:w-auto"
              size="lg"
              radius="full"
              startContent={
                <MessageSquare
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    isSubscribing ? "animate-spin" : ""
                  }`}
                />
              }
              isLoading={isSubscribing}
              onPress={async () => {
                try {
                  setIsSubscribing(true);
                  const auth = getAuth();
                  const user = auth.currentUser;

                  if (!user) {
                    toast.error("Please sign in to manage subscription");
                    return;
                  }

                  const endpoint = isSubscribed ? "unsubscribe" : "subscribe";
                  const response = await fetch(
                    `${
                      import.meta.env.VITE_API_BASE_URL
                    }/subscriptions/${endpoint}`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${await user.getIdToken()}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        email: user.email,
                        name: user.displayName,
                      }),
                    }
                  );
                  if (response.ok) {
                    setIsSubscribed(!isSubscribed);
                    toast.success(
                      isSubscribed
                        ? "Successfully unsubscribed from daily affirmations"
                        : "Confirm your subscription in your email!.You will receive a daily affirmation in your email at 8 AM (UTC) every day.✨"
                    );
                  } else {
                    const errorData = await response.json();
                    throw new Error(
                      errorData.message || `Failed to ${endpoint}`
                    );
                  }
                } catch (error) {
                  console.error(
                    "Error managing affirmations subscription:",
                    error
                  );
                  if (
                    error.message ===
                    "Invalid parameter: SubscriptionArn Reason: An ARN must have at least 6 elements, not 1"
                  ) {
                    toast.error(
                      "First Confirm your subscription before unsubscribing"
                    );
                  } else {
                    toast.error(
                      error.message || "Failed to manage subscription"
                    );
                  }
                } finally {
                  setIsSubscribing(false);
                }
              }}
            >
              <span className="hidden sm:inline">
                {isSubscribed ? "Unsubscribe from" : "Subscribe to"} Daily
                Affirmations
              </span>
              <span className="sm:hidden">
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </span>
              <span className="ml-1">✨</span>
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {[
          {
            name: "Google Fit",
            icon: "🏃‍♂️",
            color: "from-green-400 to-cyan-500",
            connected: isGoogleFitConnected,
            onConnect: connectToGoogleFit,
            description:
              "Track fitness activities and health metrics with Google Fit integration",
            features: ["Activity tracking", "Heart rate", "Sleep analysis"],
            demoLabel: "Demo: Click the card to interact",
          },
          {
            name: "Apple Health",
            icon: "❤️",
            color: "from-pink-500 to-rose-500",
            connected: isAppleHealthConnected,
            onConnect: connectToAppleHealth,
            description: "Sync your health and workout data from Apple Health",
            features: ["Workout data", "Vital signs", "Nutrition"],
            demoLabel: "Demo: Click the card to interact",
          },
          {
            name: "Fitbit",
            icon: "⌚",
            color: "from-blue-400 to-indigo-500",
            connected: isFitbitConnected,
            onConnect: connectToFitbit,
            description:
              "Monitor your daily activities and wellness metrics with Fitbit",
            features: ["Step counting", "Sleep quality", "Exercise tracking"],
            demoLabel: "Demo: Click the card to interact",
          },
        ].map((platform) => (
          <motion.div
            key={platform.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
          >
            <Card
              className={`
                h-full bg-[#32333a]/30 backdrop-blur-sm
                ${
                  platform.connected ? "border-green-500/30" : "border-gray-800"
                }
                hover:border-purple-500/50 transition-all duration-300
                group
              `}
            >
              <CardBody className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div
                    className={`
                w-16 h-16 rounded-full
                flex items-center justify-center
                bg-gradient-to-r ${platform.color} bg-opacity-20
                group-hover:scale-110 transition-transform duration-300
              `}
                  >
                    <span className="text-3xl">{platform.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-purple-400 transition-colors">
                      {platform.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {platform.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {platform.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-gray-300"
                    >
                      <div
                        className={`
                  w-1.5 h-1.5 rounded-full
                  bg-gradient-to-r ${platform.color}
                `}
                      />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div
                  className={`
            mt-auto flex items-center justify-between
            p-4 rounded-xl
            ${platform.connected ? "bg-green-500/10" : "bg-gray-700/30"}
            transition-colors duration-300
          `}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`
                w-2 h-2 rounded-full
                ${
                  platform.connected
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-600"
                }
              `}
                    />
                    <span
                      className={`
                text-sm font-medium
                ${platform.connected ? "text-green-400" : "text-gray-400"}
              `}
                    >
                      {platform.connected ? "Connected" : "Not Connected"}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className={`
                ${
                  platform.connected
                    ? "bg-green-500/20 text-green-400"
                    : "bg-purple-500/20 text-purple-400"
                }
                hover:opacity-80 transition-opacity
              `}
                    onPress={platform.onConnect}
                  >
                    {platform.connected ? "Manage" : "Connect"}
                  </Button>
                </div>
                <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs p-1 rounded">
                  {platform.demoLabel}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: "Connected Devices",
            value: "0/3",
            icon: <Heart className="text-pink-500" />,
            color: "from-pink-500 to-rose-500",
          },
          {
            title: "Data Synced",
            value: "Last 24h",
            icon: <Activity className="text-green-500" />,
            color: "from-green-500 to-emerald-500",
          },
          {
            title: "Active Trackers",
            value: "0 Active",
            icon: <BarChart className="text-blue-500" />,
            color: "from-blue-500 to-indigo-500",
          },
          {
            title: "Health Score",
            value: "?/100",
            icon: <Brain className="text-purple-500" />,
            color: "from-purple-500 to-violet-500",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="bg-[#32333a]/30 backdrop-blur-sm border border-gray-800"
          >
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div
                  className={`
            p-3 rounded-xl
            bg-gradient-to-r ${stat.color} bg-opacity-20
          `}
                >
                  {stat.icon}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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

        <Card className="bg-[#2a2b2e]/50 backdrop-blur-lg border border-gray-800">
          <CardBody className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="mr-2 text-orange-500" /> AI Stress Analysis
            </h3>
            <div className="flex flex-col items-center justify-center space-y-6">
              <p className="text-gray-400 text-sm text-center mb-4">
                Your stress level is analyzed by our AI model using your fitness
                data, mood patterns, and chat interactions
              </p>
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
              <div className="text-center">
                <p className="text-sm text-gray-400 mt-2">
                  Stress Level: {stressLevel}/10
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Updated daily based on your activity patterns
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="bg-[#2a2b2e]/50 backdrop-blur-lg border border-gray-800 mb-8">
        <CardBody className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold flex items-center">
              <Brain className="mr-2 text-cyan-500" /> Current Mood
            </h3>
            <Button
              className="bg-cyan-500/20 text-cyan-400"
              size="sm"
              onPress={() => setShowMoodHistory(!showMoodHistory)}
            >
              View History
            </Button>
          </div>

          {showMoodHistory && (
            <div className="mb-6">
              <div className="bg-[#1f2023] rounded-lg p-4 max-h-60 overflow-y-auto">
                {moodHistory.map((entry, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0"
                  >
                    <span className="text-gray-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    <span className="text-cyan-400">Mood: {entry.mood}/10</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              <div className="flex justify-between mt-2 text-lg text-gray-400">
                <span className="text-xl">Sad 😔</span>
                <span className="text-xl">Neutral 😐</span>
                <span className="text-xl">Happy 😊</span>
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-500"
              size="lg"
              radius="full"
              onPress={logMood}
            >
              Log Current Mood
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
