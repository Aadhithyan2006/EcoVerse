import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Overview from './pages/Overview';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EcoWorld from './pages/EcoWorld';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Quizzes from './pages/Quizzes';
import Challenges from './pages/Challenges';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';

const Private = ({ children }) => {
  const token = useSelector(s => s.auth.token);
  return token ? children : <Navigate to="/login" />;
};
const AdminOnly = ({ children }) => {
  const user = useSelector(s => s.auth.user);
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Private><Layout /></Private>}>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="eco-world" element={<EcoWorld />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="lessons/:id" element={<LessonDetail />} />
        <Route path="quizzes/:lessonId" element={<Quizzes />} />
        <Route path="challenges" element={<Challenges />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="admin" element={<AdminOnly><AdminDashboard /></AdminOnly>} />
      </Route>
    </Routes>
  );
}
