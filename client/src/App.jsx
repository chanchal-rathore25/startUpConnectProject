import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home/Home'
import StartUpConnect from './pages/Startup/StartUpConnect'
import Jobs from './pages/Jobs/Jobs'
import JobDetails from "./pages/Jobs/JobsDetails"
import About from './pages/About/About'
import SignupPage from './pages/Auth/Signup'
import LoginPage from './pages/Auth/Login'
import Profile from './pages/Profile/Profile'
import Dashboard from './pages/Dashboard/Dashboard'
import Chat from './pages/Chat/Chat'
import { Routes, Route } from 'react-router-dom';
import Footer from './components/layout/Footer'
import StartUpDetails from './pages/Startup/StartUpDetails'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import SplashScreen from './components/common/SplashScreen'

// NOTE: <BrowserRouter> is assumed to already wrap <App /> in main.jsx / index.js
// (that's how the original project was set up). Agar aisa nahi hai, to main.jsx me
// <App /> ko <BrowserRouter> se wrap kar dena.

const ComingSoon = ({ title }) => (
  <div style={{ padding: 60, fontFamily: "Inter, sans-serif" }}>
    <h2>{title}</h2>
    <p style={{ color: "#8A98A0" }}>Coming next — same design system as Startup Details.</p>
  </div>
);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
      <SocketProvider>
        <div>
          {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/startups" element={<StartUpConnect />} />
            <Route path="/startups/:id" element={<StartUpDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:conversationId" element={<Chat />} />

            {/* Upcoming pages */}
            <Route path="/search" element={<ComingSoon title="Search Page" />} />
          </Routes>
          <Footer />
        </div>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App