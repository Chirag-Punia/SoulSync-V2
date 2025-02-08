import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Progress,
  Radio,
  RadioGroup,
  Divider,
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainIcon, HeartIcon } from "lucide-react";
const ResultsSection = ({ score, severity, category }) => {
  const recommendations = getDetailedRecommendations(
    category.id,
    severity.level
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Assessment Results</h2>

        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl font-bold">{Math.round(score)}%</span>
              <p className={`text-lg font-semibold text-${severity.color}`}>
                {severity.level} Level
              </p>
            </div>
          </div>
          <Progress
            size="lg"
            value={score}
            color={severity.color}
            className="h-4 absolute bottom-0 w-full"
          />
        </div>

        <Card
          className={`bg-${severity.color}-50 dark:bg-${severity.color}-900/20`}
        >
          <CardBody className="p-6">
            <h3 className="text-xl font-semibold mb-4">Assessment Summary</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Based on your responses to the {category.title.toLowerCase()},
              you're showing {severity.level.toLowerCase()} levels of symptoms.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.entries(answers).map(([questionId, value]) => {
                const question = category.questions.find(
                  (q) => q.id.toString() === questionId
                );
                const option = question?.options.find(
                  (opt) => opt.value === value.toString()
                );

                return (
                  <div
                    key={questionId}
                    className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <p className="text-sm font-medium">{question?.question}</p>
                    <p className="text-sm text-gray-500">
                      Response: {option?.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card className="mt-6">
          <CardBody className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              Personalized Recommendations
            </h3>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <CheckIcon className="w-4 h-4" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{rec}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <h4 className="text-lg font-semibold">Next Steps</h4>
              <div className="flex flex-wrap gap-4">
                <Button
                  color="secondary"
                  variant="shadow"
                  onPress={() => (window.location.href = "/resources")}
                >
                  Find a Therapist
                </Button>
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={() => setShowTips(true)}
                >
                  View Self-Help Resources
                </Button>
                <Button
                  color="default"
                  variant="light"
                  onPress={() => setSelectedCategory(null)}
                >
                  Take Another Assessment
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {assessmentHistory.length > 0 && (
        <Card className="mt-8">
          <CardBody>
            <h3 className="text-xl font-semibold mb-4">
              Your Assessment History
            </h3>
            <div className="space-y-3">
              {assessmentHistory.map((assessment, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{assessment.category}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(assessment.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress
                      size="sm"
                      value={assessment.score}
                      color={getProgressColor(assessment.score)}
                      className="w-24"
                    />
                    <span className="text-sm font-medium">
                      {assessment.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="bg-red-50 dark:bg-red-900/20">
        <CardBody className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            Need Immediate Support?
          </h3>
          <p className="mb-4">
            If you're experiencing severe symptoms or having thoughts of
            self-harm, please don't hesitate to reach out for immediate
            assistance:
          </p>
          <div className="flex flex-wrap gap-4">
            <Button color="danger" size="lg" as="a" href="tel:988">
              Call 988 - Crisis Lifeline
            </Button>
            <Button
              color="danger"
              variant="bordered"
              size="lg"
              as="a"
              href="sms:988"
            >
              Text 988
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
const assessmentCategories = [
  {
    id: "anxiety",
    title: "Anxiety Assessment",
    icon: <BrainIcon className="w-6 h-6" />,
    description:
      "Evaluate your anxiety levels and understand potential triggers",
    color: "from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800",
    questions: [
      {
        id: 1,
        question: "How often do you feel nervous, anxious, or on edge?",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" },
        ],
      },
      {
        id: 2,
        question: "How often do you have trouble relaxing?",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" },
        ],
      },
      {
        id: 3,
        question:
          "How often do you feel restless or have difficulty sitting still?",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" },
        ],
      },
      {
        id: 4,
        question:
          "How often do you experience excessive worrying about different things?",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" },
        ],
      },
    ],
  },
  {
    id: "depression",
    title: "Depression Screening",
    icon: <HeartIcon className="w-6 h-6" />,
    description: "Check your mood and emotional well-being",
    color:
      "from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800",
    questions: [
      {
        id: 1,
        question: "How often have you felt down, depressed, or hopeless?",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" },
        ],
      },
      {
        id: 2,
        question:
          "How often do you have little interest or pleasure in doing things?",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" },
        ],
      },
      {
        id: 3,
        question:
          "How often do you have trouble falling or staying asleep, or sleeping too much?",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" },
        ],
      },
      {
        id: 4,
        question: "How often do you feel tired or have little energy?",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" },
        ],
      },
    ],
  },
  {
    id: "ptsd",
    title: "PTSD Assessment",
    description: "Evaluate symptoms related to traumatic experiences",
    color: "from-red-100 to-red-200 dark:from-red-900 dark:to-red-800",
    questions: [
      {
        id: 1,
        question:
          "How often do you have unwanted memories, nightmares, or flashbacks of a traumatic event?",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" },
        ],
      },
    ],
  },
  {
    id: "addiction",
    title: "Addiction Screening",
    description: "Assess patterns of substance use or behavioral addictions",
    color:
      "from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800",
    questions: [
      {
        id: 1,
        question:
          "How often do you find yourself engaging in addictive behaviors despite negative consequences?",
        options: [
          { value: "0", label: "Never" },
          { value: "1", label: "Rarely" },
          { value: "2", label: "Sometimes" },
          { value: "3", label: "Often" },
          { value: "4", label: "Very Often" },
        ],
      },
    ],
  },
];

function SelfAssessment() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [userName, setUserName] = useState("Chirag-Punia"); // Using the provided user login
  const [currentDateTime, setCurrentDateTime] = useState("2025-02-08 19:49:50"); // Using the provided datetime

  const getProgressColor = (score) => {
    if (score <= 25) return "success";
    if (score <= 50) return "warning";
    if (score <= 75) return "secondary";
    return "error";
  };

  const handleStartAssessment = (category) => {
    setSelectedCategory(category);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: parseInt(value),
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedCategory.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const result = calculateResults();
      setAssessmentHistory((prev) => [
        ...prev,
        {
          category: selectedCategory.title,
          date: currentDateTime,
          score: result.score,
          severity: result.severity,
        },
      ]);
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce(
      (acc, curr) => acc + curr,
      0
    );
    const maxScore = selectedCategory.questions.length * 3;
    const score = (totalScore / maxScore) * 100;

    let severity = "Minimal";
    if (score > 75) severity = "Severe";
    else if (score > 50) severity = "Moderate";
    else if (score > 25) severity = "Mild";

    return { score, severity };
  };

  const getRecommendations = (severity) => {
    const recommendations = {
      Minimal: [
        "Continue maintaining your current mental health practices",
        "Practice regular mindfulness and relaxation exercises",
        "Maintain healthy lifestyle habits",
        "Stay connected with your support system",
      ],
      Mild: [
        "Consider talking to a counselor or therapist",
        "Increase self-care activities",
        "Practice stress-management techniques",
        "Join support groups or community activities",
      ],
      Moderate: [
        "Schedule an appointment with a mental health professional",
        "Develop a structured self-care routine",
        "Learn and practice coping strategies",
        "Consider joining therapy groups",
      ],
      Severe: [
        "Seek immediate professional help",
        "Contact a crisis helpline if needed",
        "Reach out to trusted friends or family",
        "Consider intensive treatment options",
      ],
    };

    return recommendations[severity] || recommendations.Minimal;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Mental Health Self-Assessment
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Take our confidential assessments to better understand your mental
          health. Your responses are private and will help guide you toward
          appropriate resources.
        </p>
      </div>

      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <p className="text-sm text-gray-500">Welcome, {userName}</p>
          <p className="text-xs text-gray-400">{currentDateTime}</p>
        </div>
        {assessmentHistory.length > 0 && (
          <div className="text-sm text-gray-500">
            Assessments completed: {assessmentHistory.length}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {assessmentCategories.map((category) => (
              <Card
                key={category.id}
                isPressable
                onPress={() => handleStartAssessment(category)}
                className={`hover:scale-105 transition-all duration-300 bg-gradient-to-r ${category.color}`}
              >
                <CardBody className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {category.title}
                      </h3>
                      <p className="text-sm opacity-80">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="bg-white dark:bg-gray-800 shadow-xl">
              <CardBody className="p-6">
                {!showResults ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">
                        {selectedCategory.title}
                      </h2>
                      <span className="text-sm text-gray-500">
                        Question {currentQuestionIndex + 1} of{" "}
                        {selectedCategory.questions.length}
                      </span>
                    </div>

                    <Progress
                      value={
                        ((currentQuestionIndex + 1) /
                          selectedCategory.questions.length) *
                        100
                      }
                      className="h-2"
                      color="secondary"
                    />

                    <motion.div
                      key={currentQuestionIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl">
                        {
                          selectedCategory.questions[currentQuestionIndex]
                            .question
                        }
                      </h3>

                      <RadioGroup
                        onChange={(e) =>
                          handleAnswer(
                            selectedCategory.questions[currentQuestionIndex].id,
                            e.target.value
                          )
                        }
                        value={answers[
                          selectedCategory.questions[currentQuestionIndex].id
                        ]?.toString()}
                        className="space-y-3"
                      >
                        {selectedCategory.questions[
                          currentQuestionIndex
                        ].options.map((option) => (
                          <Radio
                            key={option.value}
                            value={option.value}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            {option.label}
                          </Radio>
                        ))}
                      </RadioGroup>
                    </motion.div>

                    <div className="flex justify-between pt-4">
                      <Button
                        color="danger"
                        variant="light"
                        onPress={() => setSelectedCategory(null)}
                      >
                        Exit Assessment
                      </Button>
                      <Button
                        color="secondary"
                        onPress={handleNext}
                        disabled={
                          !answers[
                            selectedCategory.questions[currentQuestionIndex].id
                          ]
                        }
                      >
                        {currentQuestionIndex ===
                        selectedCategory.questions.length - 1
                          ? "View Results"
                          : "Next Question"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    {(() => {
                      const { score, severity } = calculateResults();
                      const recommendations = getRecommendations(severity);

                      return (
                        <>
                          <div className="text-center">
                            <h2 className="text-3xl font-bold mb-6">
                              Assessment Results
                            </h2>
                            <div className="w-64 h-64 mx-auto relative">
                              <Progress
                                size="lg"
                                value={score}
                                color={getProgressColor(score)}
                                className="h-4"
                              />
                              <div className="mt-4">
                                <span className="text-4xl font-bold">
                                  {Math.round(score)}%
                                </span>
                                <p className="text-xl text-gray-600 dark:text-gray-300">
                                  {severity} Level
                                </p>
                              </div>
                            </div>

                            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <h3 className="text-2xl font-semibold mb-4">
                                Recommendations
                              </h3>
                              <div className="space-y-4">
                                {recommendations.map((rec, index) => (
                                  <div
                                    key={index}
                                    className="p-4 bg-white dark:bg-gray-700 rounded-lg"
                                  >
                                    <p>{rec}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                              <Button
                                color="secondary"
                                size="lg"
                                onPress={() => setSelectedCategory(null)}
                              >
                                Take Another Assessment
                              </Button>
                              <Button
                                color="primary"
                                size="lg"
                                as="a"
                                href="/resources"
                              >
                                Find a Therapist
                              </Button>
                            </div>
                          </div>

                          <div className="mt-8">
                            <Card className="bg-purple-50 dark:bg-purple-900/20">
                              <CardBody className="p-4">
                                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                                  This assessment has been saved to your
                                  history. You can track your progress over
                                  time.
                                </p>
                              </CardBody>
                            </Card>
                          </div>

                          {score > 75 && (
                            <Card className="mt-8 bg-red-50 dark:bg-red-900/20">
                              <CardBody className="p-6">
                                <h3 className="text-xl font-semibold mb-4">
                                  Need Immediate Support?
                                </h3>
                                <p className="mb-4">
                                  If you're experiencing severe symptoms or
                                  having thoughts of self-harm, please don't
                                  hesitate to reach out for immediate
                                  assistance:
                                </p>
                                <div className="flex flex-wrap gap-4">
                                  <Button
                                    color="danger"
                                    size="lg"
                                    as="a"
                                    href="tel:988"
                                  >
                                    Call 988 - Crisis Lifeline
                                  </Button>
                                  <Button
                                    color="danger"
                                    variant="bordered"
                                    size="lg"
                                    as="a"
                                    href="sms:988"
                                  >
                                    Text 988
                                  </Button>
                                </div>
                              </CardBody>
                            </Card>
                          )}
                        </>
                      );
                    })()}
                  </motion.div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default SelfAssessment;
