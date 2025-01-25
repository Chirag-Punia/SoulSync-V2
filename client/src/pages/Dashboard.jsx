import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";
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
} from "lucide-react";
import ExerciseTimer from "./ExerciseTimer";

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
  const [currentMood, setCurrentMood] = useState(5);
  const [weeklyGoalProgress, setWeeklyGoalProgress] = useState(60);
  const [showExerciseTimer, setShowExerciseTimer] = useState(false);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
      } catch (error) {
        console.error("Failed to fetch mood data:", error);
      }
    };

    fetchMoodData();
  }, []);

  const handleMoodInput = (event) => {
    setCurrentMood(parseInt(event.target.value, 10));
  };

  const startExercise = () => {
    setShowExerciseTimer(true);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
        Welcome Back, Sarah!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center text-2xl font-semibold text-[#8A56CC] mb-4">
              <BarChart className="mr-2" /> Mood Tracker
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#8A56CC"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center text-2xl font-semibold text-[#8A56CC] mb-4">
              <Activity className="mr-2" /> Stress Level
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="text-[#8A56CC] progress-ring__circle stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * stressLevel) / 10}
                    transform="rotate(-90 50 50)"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-[#8A56CC]">
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
                className="w-[80%] accent-[#8A56CC]"
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <div className="flex items-center text-2xl font-semibold text-[#8A56CC] mb-4">
            <Brain className="mr-2" /> How are you feeling right now?
          </div>
          <div className="flex flex-col items-center space-y-4">
            <input
              type="range"
              min="1"
              max="10"
              value={currentMood}
              onChange={handleMoodInput}
              className="w-[80%] accent-[#8A56CC]"
            />
            <div className="flex justify-between w-full text-sm text-gray-600 dark:text-gray-400">
              <span>Very Low</span>
              <span>Neutral</span>
              <span>Very High</span>
            </div>
            <button
              className="px-4 py-2 bg-[#8A56CC] text-white rounded-md hover:bg-[#7545B7] transition-colors"
              onClick={() => console.log("Mood logged:", currentMood)}
            >
              Log Mood
            </button>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center text-xl font-semibold text-[#8A56CC] mb-2">
              <Calendar className="mr-2" /> Weekly Goal
            </div>
            <p className="mb-2">Meditate for 10 minutes daily</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-[#8A56CC] h-2.5 rounded-full"
                style={{ width: `${weeklyGoalProgress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {weeklyGoalProgress}% completed
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center text-xl font-semibold text-[#8A56CC] mb-2">
              <Brain className="mr-2" /> Mindfulness Exercise
            </div>
            <p className="mb-2">Try this 5-minute breathing exercise:</p>
            <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400">
              <li>Find a comfortable position</li>
              <li>Close your eyes and focus on your breath</li>
              <li>Inhale for 4 counts, hold for 4, exhale for 4</li>
              <li>Repeat for 5 minutes</li>
            </ol>
            <button
              className="mt-4 px-4 py-2 bg-[#8A56CC] text-white rounded-md hover:bg-[#7545B7] transition-colors"
              onClick={startExercise}
            >
              Start Exercise
            </button>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center text-xl font-semibold text-[#8A56CC] mb-2">
              <MessageSquare className="mr-2" /> Support Groups
            </div>
            <p className="mb-2">2 new messages in "Stress Management"</p>
            <button className="w-full mt-2 px-4 py-2 bg-[#8A56CC] text-white rounded-md hover:bg-[#7545B7] transition-colors">
              View Messages
            </button>
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
