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
import { useState, useEffect } from "react";
import { moodService } from "../services/api";

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

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
      } catch (error) {
        console.error("Failed to fetch mood data:", error);
      }
    };

    fetchMoodData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
        Welcome Back!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h2 className="text-2xl font-semibold mb-4">Mood Tracker</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="mood" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-2xl font-semibold mb-4">
              Current Stress Level
            </h2>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div
                  className="absolute inset-0 rounded-full border-8"
                  style={{
                    borderColor: `hsl(${120 - stressLevel * 12}, 70%, 50%)`,
                    transform: "rotate(-90deg)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{stressLevel}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-xl font-semibold mb-2">Daily Tips</h3>
            <p>Take a 5-minute breathing break every 2 hours.</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-xl font-semibold mb-2">Next Activity</h3>
            <p>Mindfulness meditation at 3:00 PM</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-xl font-semibold mb-2">Support Groups</h3>
            <p>2 new messages in "Stress Management"</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
