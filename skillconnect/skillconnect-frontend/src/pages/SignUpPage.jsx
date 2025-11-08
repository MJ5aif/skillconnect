        import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import 'firebaseui/dist/firebaseui.css';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { auth } from '../firebase/config.js';

function SignUpPage() {
  const navigate = useNavigate();

  const uiConfig = useMemo(
    () => ({
      signInFlow: 'popup',
      signInOptions: [
        {
          provider: EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true,
        },
        GoogleAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          if (authResult?.additionalUserInfo?.isNewUser) {
            navigate('/role-selection', { replace: true });
          } else {
            navigate('/signin', { replace: true });
          }

          return false;
        },
      },
    }),
    [navigate],
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue">
              Join SkillConnect
            </span>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Create your account</h1>
            <p className="mt-2 text-sm text-gray-500">
              Access mentor-led sessions, cohort-based courses, and a global community of learners.
            </p>
          </div>

          <div className="mt-8">
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            By continuing you agree to our
            <span className="mx-1 font-semibold text-brand-blue">Terms</span>
            and
            <span className="mx-1 font-semibold text-brand-blue">Privacy Policy</span>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SignUpPage;
