import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import BlogPage from './components/BlogPage';
import BlogPostDetail from './components/BlogPostDetail';
import CompaniesPage from './components/CompaniesPage';
import OfferPage from './components/OfferPage';
import Footer from './components/Footer';
import ProfilePage from './components/ProfilePage';
import JobListPage from './components/JobListPage';
import CreateJobPage from './components/CreateJobPage';
import JobDetailPage from './components/JobDetailPage';
import MyApplicationsPage from './components/MyApplicationsPage';
import ApplicationsPage from './components/ApplicationsPage';
import MyJobsPage from './components/MyJobsPage';
import AdminConsole from './components/AdminConsole';
import DebugPage from './components/DebugPage';
import PrivateRoute from './components/PrivateRoute';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<OfferPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostDetail />} />
        <Route path="/kompanije" element={<CompaniesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/jobs" element={<JobListPage />} />
        
        {/* Privatna ruta - samo company i alumni */}
        <Route 
          path="/create-job" 
          element={
            <PrivateRoute allowedRoles={['company', 'alumni']}>
              <CreateJobPage />
            </PrivateRoute>
          } 
        />
        
        <Route path="/job/:id" element={<JobDetailPage />} />
        
        {/* Privatna ruta - samo student/alumni */}
        <Route 
          path="/my-applications" 
          element={
            <PrivateRoute allowedRoles={['student', 'alumni']}>
              <MyApplicationsPage />
            </PrivateRoute>
          } 
        />
        
        {/* Privatna ruta - samo company */}
        <Route 
          path="/applications" 
          element={
            <PrivateRoute allowedRoles={['company']}>
              <ApplicationsPage />
            </PrivateRoute>
          } 
        />

        {/* Privatna ruta - samo company i alumni */}
        <Route 
          path="/my-jobs" 
          element={
            <PrivateRoute allowedRoles={['company', 'alumni']}>
              <MyJobsPage />
            </PrivateRoute>
          } 
        />
        
        {/* Privatna ruta - samo admin */}
        <Route 
          path="/admin-console" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminConsole />
            </PrivateRoute>
          } 
        />
        
        <Route path="/debug" element={<DebugPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;