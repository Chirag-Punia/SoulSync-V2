import React, { useState, useEffect } from "react";
import { Card, Button, Progress, Textarea } from "@nextui-org/react";
import { Trophy, Clock } from "lucide-react";

function PersonalGrowthTab() {
  const [challenges, setChallenges] = useState([
    {
      title: "Gratitude Challenge",
      task: "Write down 3 things you're grateful for every day",
      duration: "7 days",
      reward: "Grateful Heart badge",
      isStarted: false,
      isCompleted: false,
      timer: 24 * 60 * 60,
      progress: 0,
      notes: "",
      isNoteSaved: false,
    },
    {
      title: "Daily Journaling Challenge",
      task: "Write down thoughts, emotions, and one positive experience every evening",
      duration: "7 days",
      reward: "Reflective Thinker badge",
      isStarted: false,
      isCompleted: false,
      timer: 24 * 60 * 60,
      progress: 0,
      notes: "",
      isNoteSaved: false,
    },
    {
      title: "Book Therapy Challenge",
      task: "Read or listen to a chapter of a positive or self-help book daily",
      duration: "7 days",
      reward: "Bookworm milestone",
      isStarted: false,
      isCompleted: false,
      timer: 24 * 60 * 60,
      progress: 0,
      notes: "",
      isNoteSaved: false,
    },
    {
      title: "Limit Negative Thoughts Challenge",
      task: "Catch and reframe 3 negative thoughts into positive ones each day",
      duration: "5 days",
      reward: "Positive Thinker badge",
      isStarted: false,
      isCompleted: false,
      timer: 24 * 60 * 60,
      progress: 0,
      notes: "",
      isNoteSaved: false,
    },
  ]);

  useEffect(() => {
    const savedChallenges = localStorage.getItem("personalGrowthChallenges");
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    }
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setChallenges((prevChallenges) =>
        prevChallenges.map((challenge) => {
          if (challenge.isStarted && !challenge.isCompleted) {
            const newTimer = challenge.timer > 0 ? challenge.timer - 1 : 0;
            const newProgress = challenge.isStarted
              ? Math.min(100, 100 - (newTimer / (24 * 60 * 60)) * 100)
              : 0;

            return {
              ...challenge,
              timer: newTimer,
              progress: newProgress,
              isCompleted: newTimer === 0,
            };
          }
          return challenge;
        })
      );
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "personalGrowthChallenges",
      JSON.stringify(challenges)
    );
  }, [challenges]);

  const formatTimer = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleStartChallenge = (index) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[index].isStarted = true;
    setChallenges(updatedChallenges);
  };

  const handleCompleteChallenge = (index) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[index].isCompleted = true;
    setChallenges(updatedChallenges);
  };

  const handleSaveNote = (index, note) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[index].notes = note;
    updatedChallenges[index].isNoteSaved = true;
    setChallenges(updatedChallenges);
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {challenges.map((challenge, index) => (
        <Card key={index} className="p-4 space-y-4 w-full max-w-sm">
          <h3 className="text-xl font-semibold">{challenge.title}</h3>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Task:</span> {challenge.task}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Duration:</span>{" "}
              {challenge.duration}
            </p>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <p className="text-purple-600 font-medium">{challenge.reward}</p>
            </div>
          </div>

          {challenge.isStarted && !challenge.isCompleted && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">
                {formatTimer(challenge.timer)}
              </span>
            </div>
          )}

          {challenge.isStarted && !challenge.isCompleted && (
            <>
              <Progress
                value={challenge.progress}
                className="max-w-md"
                color="secondary"
                label={`Progress: ${challenge.progress.toFixed(0)}%`}
              />
              {!challenge.isNoteSaved ? (
                <>
                  <Textarea
                    placeholder="Add your notes here..."
                    value={challenge.notes}
                    onChange={(e) => {
                      const updatedChallenges = [...challenges];
                      updatedChallenges[index].notes = e.target.value;
                      setChallenges(updatedChallenges);
                    }}
                  />
                  <Button
                    color="primary"
                    className="w-full mt-2"
                    onClick={() => handleSaveNote(index, challenge.notes)}
                  >
                    Save Note
                  </Button>
                </>
              ) : (
                <p className="mt-2 text-gray-600">
                  <span className="font-medium">Saved Note:</span>{" "}
                  {challenge.notes}
                </p>
              )}
              <Button
                color="success"
                className="w-full mt-2"
                onClick={() => handleCompleteChallenge(index)}
              >
                Complete Challenge
              </Button>
            </>
          )}

          {challenge.isCompleted && (
            <p className="text-green-600 font-semibold">Challenge Completed!</p>
          )}

          {!challenge.isStarted && (
            <Button
              color="secondary"
              className="w-full"
              onClick={() => handleStartChallenge(index)}
            >
              Start Challenge
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
}

export default PersonalGrowthTab;
