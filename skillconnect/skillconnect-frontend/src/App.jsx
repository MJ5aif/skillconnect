import { Route, Routes, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import LearnerDashboardLayout from './layouts/LearnerDashboardLayout';
import TeacherDashboardLayout from './layouts/TeacherDashboardLayout';
import SettingsLayout from './layouts/SettingsLayout';
import FullScreenLayout from './layouts/FullScreenLayout';

// Protected Route
import ProtectedRoute from './utils/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import ForgotPassword from './pages/ForgotPassword';
import AboutUs from './pages/AboutUs';
import HelpCenter from './pages/HelpCenter';
import BrowsePage from './pages/BrowsePage';
import CourseDetailPage from './pages/CourseDetailPage';
import TeacherProfilePage from './pages/TeacherProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

// Onboarding Pages
import RoleSelectionPage from './pages/RoleSelectionPage';
import TeacherOnboarding from './pages/TeacherOnboarding';
import LearnerOnboarding from './pages/LearnerOnboarding';

// Learner Dashboard Pages
import LearnerDashboard from './pages/learner/LearnerDashboard';
import MyLearningPage from './pages/learner/MyLearningPage';
import ClassroomPage from './pages/learner/ClassroomPage';
import MySchedulePage from './pages/learner/MySchedulePage';

// Teacher Dashboard Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import MyServicesPage from './pages/teacher/MyServicesPage';
import ServiceWizardPage from './pages/teacher/ServiceWizardPage';
import OrderManagementPage from './pages/teacher/OrderManagementPage';
import EarningsPage from './pages/teacher/EarningsPage';
import ManageAvailabilityPage from './pages/teacher/ManageAvailabilityPage';
import BatchManagementPage from './pages/teacher/BatchManagementPage';

// Shared Pages
import MessagingPage from './pages/shared/MessagingPage';
import VideoClassPage from './pages/shared/VideoClassPage';
import CommunityFeed from './pages/shared/CommunityFeed';

// Settings Pages
import ProfileSettings from './pages/settings/ProfileSettings';
import AccountSettings from './pages/settings/AccountSettings';
import NotificationSettings from './pages/settings/NotificationSettings';

function App() {
  return (
    <Routes>
      {/* ========== PUBLIC ROUTES (With Navbar & Footer) ========== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/mentors/:mentorId" element={<TeacherProfilePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      </Route>

      {/* ========== AUTH ROUTES (No Navbar) ========== */}
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* ========== ONBOARDING ROUTES (No Navbar) ========== */}
      <Route path="/role-selection" element={<RoleSelectionPage />} />
      <Route path="/teacher-onboarding" element={<TeacherOnboarding />} />
      <Route path="/learner-onboarding" element={<LearnerOnboarding />} />

      {/* ========== LEARNER DASHBOARD ROUTES (Protected) ========== */}
      <Route
        path="/learn"
        element={
          <ProtectedRoute requiredRole="learner">
            <LearnerDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<LearnerDashboard />} />
        <Route path="my-learning" element={<MyLearningPage />} />
        <Route path="classroom/:courseId" element={<ClassroomPage />} />
        <Route path="my-schedule" element={<MySchedulePage />} />
      </Route>

      {/* ========== TEACHER DASHBOARD ROUTES (Protected) ========== */}
      <Route
        path="/teach"
        element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="services" element={<MyServicesPage />} />
        <Route path="services/new" element={<ServiceWizardPage />} />
        <Route path="services/:serviceId/edit" element={<ServiceWizardPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="earnings" element={<EarningsPage />} />
        <Route path="availability" element={<ManageAvailabilityPage />} />
        <Route path="batches" element={<BatchManagementPage />} />
      </Route>

      {/* ========== SETTINGS ROUTES (Protected, Shared) ========== */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsLayout />
          </ProtectedRoute>
        }
      >
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="account" element={<AccountSettings />} />
        <Route path="notifications" element={<NotificationSettings />} />
      </Route>

      {/* ========== FULLSCREEN ROUTES (Protected, Immersive - No Navbar/Sidebar) ========== */}
      <Route element={<FullScreenLayout />}>
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/class/:sessionId"
          element={
            <ProtectedRoute>
              <VideoClassPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <CommunityFeed />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
