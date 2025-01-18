import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import AdminPage from '../pages/AdminPage';
import UserPage from '../pages/UserPage';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

const Router: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Private routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
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

      {/* Role-based routes */}
      <Route
        path="/admin"
        element={
          <RoleRoute requiredRoles={['admin']}>
            <AdminPage />
          </RoleRoute>
        }
      />
      <Route
        path="/user"
        element={
          <RoleRoute requiredRoles={['user', 'manager']}>
            <UserPage />
          </RoleRoute>
        }
      />

      {/* Catch-all or 404 */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default Router;
