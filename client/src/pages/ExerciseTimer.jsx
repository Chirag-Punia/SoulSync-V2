import React, { useState, useEffect } from "react";

const ExerciseTimer = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleClose = () => {
    if (window.confirm("Are you sure you want to end the exercise?")) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold text-[#8A56CC] mb-4">
          Breathing Exercise
        </h2>
        <p className="text-6xl font-bold text-[#8A56CC] mb-8">
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </p>
        <p className="text-xl mb-4 text-indigo-700">
          {timeLeft > 0
            ? "Breathe in... Hold... Breathe out..."
            : "Exercise Complete!"}
        </p>

        <button
          className="px-6 py-2 bg-[#8A56CC] text-white rounded-md hover:bg-[#7545B7] transition-colors"
          onClick={handleClose}
        >
          {timeLeft > 0 ? "End Exercise" : "Close"}
        </button>
      </div>
    </div>
  );
};

export default ExerciseTimer;
