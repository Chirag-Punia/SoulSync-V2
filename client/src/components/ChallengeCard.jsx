import React from "react";
import { Card, Button, Progress, Input, Textarea } from "@nextui-org/react";
import { Trophy } from "lucide-react";

function ChallengeCard({
  title,
  task,
  reward,
  duration,
  progress,
  onStart,
  onComplete,
  onAddNote,
  isStarted,
  isCompleted,
  notes,
}) {
  return (
    <Card className="p-4 space-y-4 w-full sm:w-auto max-w-xs mx-auto">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">Task:</span> {task}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Duration:</span> {duration}
        </p>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <p className="text-purple-600 font-medium">{reward}</p>
        </div>
      </div>

      {isStarted && !isCompleted && (
        <>
          <Progress
            value={progress}
            className="max-w-md"
            color="secondary"
            label={`Progress: ${progress}%`}
          />
          <Textarea
            placeholder="Add your notes here..."
            value={notes || ""}
            onChange={(e) => onAddNote(e.target.value)}
            className="mt-2"
          />
          <Button color="success" onClick={onComplete} className="w-full mt-2">
            Complete Challenge
          </Button>
        </>
      )}

      {isCompleted && (
        <p className="text-green-600 font-semibold">Challenge Completed!</p>
      )}

      {!isStarted && (
        <Button color="secondary" className="w-full" onClick={onStart}>
          Start Challenge
        </Button>
      )}
    </Card>
  );
}

export default ChallengeCard;
