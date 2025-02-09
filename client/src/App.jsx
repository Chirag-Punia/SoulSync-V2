import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "../src/context/ThemeContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import ChatBot from "./pages/ChatBot";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicRoute from "./components/PublicRoute";
import GroupTherapy from "./pages/GroupTherapy";
import TherapyRoom from "./pages/TherapyRoom";
import ErrorBoundary from "./components/ErrorBoundary";
import EmotionDetector from "./pages/EmotionDetector";
import Dashboard from "./pages/Dashboard.jsx";
import ErrorPage from "./pages/ErrorPage";

const App = () => {
  return (
    <>
      <ThemeProvider>
        <NextUIProvider>
          <ToastContainer />
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <PublicRoute>
                        <LandingPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <PublicRoute>
                        <Signup />
                      </PublicRoute>
                    }
                  />

                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <PrivateRoute>
                        <ChatBot />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/group-therapy"
                    element={
                      <PrivateRoute>
                        <GroupTherapy />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/community"
                    element={
                      <PrivateRoute>
                        <Community />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/resources"
                    element={
                      <PrivateRoute>
                        <Resources />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/EmotionDetector"
                    element={
                      <PrivateRoute>
                        <EmotionDetector />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/group-therapy/:roomId"
                    element={
                      <PrivateRoute>
                        <ErrorBoundary>
                          <TherapyRoom />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </main>
            </div>
          </Router>
        </NextUIProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
