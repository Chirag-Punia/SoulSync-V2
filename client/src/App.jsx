import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ChatBot from './pages/ChatBot';
import Community from './pages/Community';
import Resources from './pages/Resources';
import Profile from './pages/Profile';

function App() {
  return (
    <NextUIProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat" element={<ChatBot />} />
              <Route path="/community" element={<Community />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </NextUIProvider>
  );
}

export default App;