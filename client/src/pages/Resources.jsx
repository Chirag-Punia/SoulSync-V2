import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { scheduleService } from "../services/scheduleService";
import { auth } from "../services/firebaseConfig";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import ChallengesTabs from "../components/ChallengesTabs";

import MusicTherapy from "./MusicTherapy";
const resourceCategories = [
  {
    id: 1,
    title: "Mental Health Articles",
    resources: [
      {
        id: 1,
        title: "Understanding Anxiety",
        type: "article",
        link: "https://www.depression.org.nz/understanding-mental-health/understanding-anxiety",
      },
      {
        id: 2,
        title: "Depression: Signs and Symptoms",
        type: "article",
        link: "https://www.depression.org.nz/understanding-mental-health/understanding-depression",
      },
      {
        id: 3,
        title: "Stress Management Techniques",
        type: "article",
        link: "https://www.headspace.com/stress",
      },
    ],
  },
  {
    id: 2,
    title: "Meditation Guides",
    resources: [
      {
        id: 4,
        title: "5-Minute Breathing Exercise",
        type: "video",
        link: "https://www.headspace.com/meditation/5-minute-meditation",
      },
      {
        id: 5,
        title: "Guided Sleep Meditation",
        type: "audio",
        link: "https://www.headspace.com/meditation/sleep",
      },
      {
        id: 6,
        title: "Mindfulness Basics",
        type: "article",
        link: "https://www.headspace.com/mindfulness",
      },
    ],
  },
  {
    id: 3,
    title: "Crisis Support",
    resources: [
      { id: 7, title: "24/7 Crisis Hotline", type: "contact", link: "tel:988" },
      {
        id: 8,
        title: "Find a Therapist",
        type: "tool",
        link: "https://www.psychologytoday.com/us/therapists",
      },
      {
        id: 9,
        title: "Emergency Resources",
        type: "article",
        link: "https://www.thestatesman.com/india/24x7-toll-free-mental-health-rehabilitation-helpline-kiran-launched-13-languages-1502922716.html",
      },
    ],
  },
];

function Resources() {
  const [activeTab, setActiveTab] = useState("resources"); // Add this with your other state declarations
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskTime, setTaskTime] = useState("");
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isChallengesExpanded, setIsChallengesExpanded] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchSchedule = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const formattedDate = taskDate.toISOString().split("T")[0];
      const data = await scheduleService.getSchedule(userId, formattedDate);
      setSchedule(data.tasks);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateTask = async () => {
    if (!userId || !taskTitle || !taskTime) {
      alert("Please provide task title and time.");
      return;
    }

    try {
      const task = {
        title: taskTitle,
        description: taskDescription,
        date: taskDate.toISOString().split("T")[0],
        time: taskTime,
        completed: false,
      };

      if (editingTask) {
        await scheduleService.updateTask(userId, editingTask._id, task);
      } else {
        await scheduleService.addTask(userId, task);
      }

      fetchSchedule();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding/updating task:", error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    if (!userId) return;
    try {
      var completed = true;
      await scheduleService.updateTask(userId, taskId, completed);
      fetchSchedule();
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!userId) return;
    try {
      await scheduleService.deleteTask(userId, taskId);
      fetchSchedule();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const resetForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskTime("");
    setEditingTask(null);
  };

  useEffect(() => {
    if (userId) {
      fetchSchedule();
    }
  }, [userId, taskDate]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Resources
        </h1>
        {selectedCategory && (
          <Button
            color="primary"
            variant="light"
            onPress={() => setSelectedCategory(null)}
          >
            Back to Categories
          </Button>
        )}
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        <Button
          color={activeTab === "resources" ? "primary" : "default"}
          variant={activeTab === "resources" ? "shadow" : "light"}
          onPress={() => setActiveTab("resources")}
          className="flex-1 md:flex-none"
        >
          Health Resources
        </Button>
        <Button
          color={activeTab === "music" ? "primary" : "default"}
          variant={activeTab === "music" ? "shadow" : "light"}
          onPress={() => setActiveTab("music")}
          className="flex-1 md:flex-none"
        >
          Music Therapy
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === "resources" ? (
        <>
          {!selectedCategory ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resourceCategories.map((category) => (
                <Card
                  key={category.id}
                  isPressable
                  onPress={() => setSelectedCategory(category)}
                  className="hover:scale-105 transition-transform bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-700 dark:to-primary-800"
                >
                  <CardBody className="p-6">
                    <h2 className="text-2xl font-semibold mb-2">
                      {category.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {category.resources.length} resources available
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">
                {selectedCategory.title}
              </h2>
              {selectedCategory.resources.map((resource) => (
                <Card
                  key={resource.id}
                  className="bg-gradient-to-r from-secondary-100 to-secondary-200 dark:from-secondary-700 dark:to-secondary-800"
                >
                  <CardBody className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          Type: {resource.type}
                        </p>
                      </div>
                      <Button
                        color="primary"
                        variant="shadow"
                        as="a"
                        href={resource.link}
                        target="_blank"
                      >
                        Access Resource
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          <Card className="mt-8 bg-gradient-to-br from-tertiary-100 to-tertiary-200 dark:from-tertiary-700 dark:to-tertiary-800">
            <CardBody>
              <div
                className="flex justify-between items-center cursor-pointer"
                onPress={() => setIsChallengesExpanded(!isChallengesExpanded)}
              >
                <h2 className="text-3xl font-semibold">Wellness Challenges</h2>
                <Button
                  auto
                  light
                  onPress={() => setIsChallengesExpanded(!isChallengesExpanded)}
                >
                  {isChallengesExpanded ? "Collapse" : "Explore Challenges"}
                </Button>
              </div>
              {isChallengesExpanded && (
                <div className="mt-4">
                  <ChallengesTabs />
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="mt-8 bg-gradient-to-br from-tertiary-100 to-tertiary-200 dark:from-tertiary-700 dark:to-tertiary-800">
            <CardBody>
              <div
                className="flex justify-between items-center cursor-pointer"
                onPress={() => setIsScheduleExpanded(!isScheduleExpanded)}
              >
                <h2 className="text-3xl font-semibold">Your Daily Schedule</h2>
                <Button
                  auto
                  light
                  onPress={() => setIsScheduleExpanded(!isScheduleExpanded)}
                >
                  {isScheduleExpanded ? "Collapse" : "Expand"}
                </Button>
              </div>
              {isScheduleExpanded && (
                <div className="mt-4">
                  <div className="mb-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <DatePicker
                        selected={taskDate}
                        onChange={(date) => setTaskDate(date)}
                        customInput={
                          <Button isDisabled auto light>
                            <CalendarIcon className="mr-2" />
                            {taskDate.toLocaleDateString()}
                          </Button>
                        }
                      />
                    </div>
                    <Button
                      color="primary"
                      auto
                      onPress={() => setIsModalOpen(true)}
                    >
                      <PlusIcon className="mr-2" />
                      Add Task
                    </Button>
                  </div>
                  {loading ? (
                    <div className="flex justify-center">
                      <Spinner size="xl" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {schedule.length > 0 ? (
                        schedule.map((task) => (
                          <Card
                            key={task._id}
                            className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
                          >
                            <CardBody>
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="text-xl font-semibold">
                                    {task.title}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {task.time}
                                  </p>
                                  {task.description && (
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                      {task.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    color={
                                      task.completed ? "success" : "warning"
                                    }
                                    auto
                                    onPress={() => handleCompleteTask(task._id)}
                                  >
                                    {task.completed
                                      ? "Completed"
                                      : "Mark as Completed"}
                                  </Button>
                                  <Button
                                    color="error"
                                    auto
                                    onPress={() => handleDeleteTask(task._id)}
                                  >
                                    <TrashIcon />
                                  </Button>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        ))
                      ) : (
                        <p className="text-center text-gray-500">
                          No tasks for the selected date
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="mt-8 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-700 dark:to-red-800">
            <CardBody>
              <h3 className="text-xl font-semibold mb-2">
                Need Immediate Help?
              </h3>
              <p className="mb-4">
                If you're in crisis or having thoughts of suicide, please reach
                out:
              </p>
              <Button color="danger" size="lg" as="a" href="tel:988">
                Call 988 - Crisis Lifeline
              </Button>
            </CardBody>
          </Card>
        </>
      ) : (
        <MusicTherapy />
      )}

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
      >
        <ModalContent>
          <ModalHeader>
            {editingTask ? "Edit Task" : "Add New Task"}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="mb-4"
            />
            <Textarea
              label="Task Description (optional)"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="mb-4"
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Date
              </label>
              <DatePicker
                selected={taskDate}
                onChange={(date) => setTaskDate(date)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <Input
              label="Task Time"
              type="time"
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
              className="mb-4"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={handleAddOrUpdateTask}>
              {editingTask ? "Update Task" : "Add Task"}
            </Button>
            <Button
              color="danger"
              variant="light"
              onPress={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Resources;
