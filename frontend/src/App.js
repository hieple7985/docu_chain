import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import DocumentList from './pages/documents/DocumentList';
import DocumentDetail from './pages/documents/DocumentDetail';
import DocumentUpload from './pages/documents/DocumentUpload';
import DocumentEdit from './pages/documents/DocumentEdit';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="documents" element={<DocumentList />} />
          <Route path="documents/upload" element={<DocumentUpload />} />
          <Route path="documents/:id" element={<DocumentDetail />} />
          <Route path="documents/:id/edit" element={<DocumentEdit />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
