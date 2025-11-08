import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import RoleSelectionPage from './pages/RoleSelectionPage.jsx';
import TeacherOnboarding from './pages/TeacherOnboarding.jsx';
import LearnerOnboarding from './pages/LearnerOnboarding.jsx';
import AboutUs from './pages/AboutUs.jsx';
import LearnerDashboard from './pages/learner/LearnerDashboard.jsx';
import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx';
import BrowsePage from './pages/BrowsePage.jsx';
import CourseDetailPage from './pages/CourseDetailPage.jsx';
import HelpCenter from './pages/HelpCenter.jsx';
import TeacherProfilePage from './pages/TeacherProfilePage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import ClassroomPage from './pages/learner/ClassroomPage.jsx';
import MyLearningPage from './pages/learner/MyLearningPage.jsx';
import MySchedulePage from './pages/learner/MySchedulePage.jsx';
import MyServicesPage from './pages/teacher/MyServicesPage.jsx';
import ServiceWizardPage from './pages/teacher/ServiceWizardPage.jsx';
import OrderManagementPage from './pages/teacher/OrderManagementPage.jsx';
import EarningsPage from './pages/teacher/EarningsPage.jsx';
import ManageAvailabilityPage from './pages/teacher/ManageAvailabilityPage.jsx';
import BatchManagementPage from './pages/teacher/BatchManagementPage.jsx';
import MessagingPage from './pages/shared/MessagingPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/role-selection" element={<RoleSelectionPage />} />
      <Route path="/teacher-onboarding" element={<TeacherOnboarding />} />
      <Route path="/learner-onboarding" element={<LearnerOnboarding />} />
      <Route path="/dashboard/learn" element={<LearnerDashboard />} />
      <Route path="/dashboard/learn/courses" element={<MyLearningPage />} />
      <Route path="/dashboard/learn/classroom" element={<ClassroomPage />} />
      <Route path="/dashboard/learn/schedule" element={<MySchedulePage />} />
      <Route path="/dashboard/teach" element={<TeacherDashboard />} />
      <Route path="/dashboard/teach/services" element={<MyServicesPage />} />
      <Route path="/dashboard/teach/orders" element={<OrderManagementPage />} />
      <Route path="/dashboard/teach/earnings" element={<EarningsPage />} />
      <Route path="/dashboard/teach/schedule" element={<ManageAvailabilityPage />} />
      <Route path="/dashboard/teach/batches" element={<BatchManagementPage />} />
      <Route path="/dashboard/teach/services/new" element={<ServiceWizardPage />} />
      <Route path="/dashboard/teach/services/:serviceId/edit" element={<ServiceWizardPage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/courses/:courseId" element={<CourseDetailPage />} />
      <Route path="/mentors/:mentorId" element={<TeacherProfilePage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/confirmation" element={<OrderConfirmationPage />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/messages" element={<MessagingPage />} />
      {/* Additional routes will be registered here as we build out the app */}
    </Routes>
  );
}

export default App;
