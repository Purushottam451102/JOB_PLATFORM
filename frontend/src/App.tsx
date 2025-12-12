import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import { Home, Login, Register, JobListing, JobDetail, EmployerDashboard, CandidateDashboard, CreateJob, Profile, CreateCompany, EmployerApplications } from './pages';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, roles }: { children: React.ReactElement, roles?: string[] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-transparent flex flex-col">
          <Toaster position="top-right" />
          <Navbar />
          <div className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={
                <ProtectedRoute>
                  <JobListing />
                </ProtectedRoute>
              } />
              <Route path="/jobs/:id" element={<JobDetail />} />

              <Route path="/employer/dashboard" element={
                <ProtectedRoute roles={['EMPLOYER']}>
                  <EmployerDashboard />
                </ProtectedRoute>
              } />

              <Route path="/employer/applications" element={
                <ProtectedRoute roles={['EMPLOYER']}>
                  <EmployerApplications />
                </ProtectedRoute>
              } />

              <Route path="/candidate/dashboard" element={
                <ProtectedRoute roles={['CANDIDATE']}>
                  <CandidateDashboard />
                </ProtectedRoute>
              } />

              <Route path="/employer/companies/create" element={
                <ProtectedRoute roles={['EMPLOYER']}>
                  <CreateCompany />
                </ProtectedRoute>
              } />

              <Route path="/jobs/create" element={
                <ProtectedRoute roles={['EMPLOYER']}>
                  <CreateJob />
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute roles={['CANDIDATE', 'EMPLOYER']}>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
