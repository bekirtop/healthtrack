import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './auth/AuthContext';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './routes/PrivateRoute';
import RoleGuard from './routes/RoleGuard';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminDoctors from './pages/Admin/Doctors';
import AdminPatients from './pages/Admin/Patients';
import AdminDoctorPatients from './pages/Admin/DoctorPatients';

// Doctor Pages
import DoctorDashboard from './pages/Doctor/Dashboard';
import DoctorPatients from './pages/Doctor/Patients';
import PatientDetails from './pages/Doctor/PatientDetails';
import DoctorSocialPosts from './pages/Doctor/SocialPosts';
import DoctorEducationalMaterials from './pages/Doctor/EducationalMaterials';

function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Box>
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Default redirect based on role */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              role === 'Admin' ? (
                <Navigate to="/admin/dashboard" />
              ) : role === 'Doctor' ? (
                <Navigate to="/doctor/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Account Route (accessible by all authenticated users) */}
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['Admin']}>
                <AdminDashboard />
              </RoleGuard>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['Admin']}>
                <AdminDoctors />
              </RoleGuard>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['Admin']}>
                <AdminPatients />
              </RoleGuard>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/doctor-patients"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['Admin']}>
                <AdminDoctorPatients />
              </RoleGuard>
            </PrivateRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['Doctor']}>
                <DoctorDashboard />
              </RoleGuard>
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['Doctor']}>
                <DoctorPatients />
              </RoleGuard>
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor/patient/:patientId"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['Doctor']}>
                <PatientDetails />
              </RoleGuard>
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor/social"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['Doctor']}>
                <DoctorSocialPosts />
              </RoleGuard>
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor/educational"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['Doctor']}>
                <DoctorEducationalMaterials />
              </RoleGuard>
            </PrivateRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Box>
  );
}

export default App;