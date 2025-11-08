import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import 'firebaseui/dist/firebaseui.css';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { auth, db } from '../firebase/config.js';

function SignInPage() {
  const navigate = useNavigate();

  const uiConfig = useMemo(
    () => ({
      signInFlow: 'popup',
      signInOptions: [
        EmailAuthProvider.PROVIDER_ID,
        GoogleAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: async (authResult) => {
          try {
            const userId = authResult?.user?.uid;
            if (!userId) {
              navigate('/signin', { replace: true });
              return false;
            }

            const userDocRef = doc(db, 'users', userId);
            const userSnapshot = await getDoc(userDocRef);
            const userData = userSnapshot.data();
            const role = userData?.role;

            if (role === 'learner') {
              navigate('/dashboard/learn', { replace: true });
            } else if (role === 'teacher') {
              navigate('/dashboard/teach', { replace: true });
            } else {
              navigate('/role-selection', { replace: true });
            }
          } catch (error) {
            console.error('Error fetching user role after sign-in:', error);
            navigate('/role-selection', { replace: true });
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
              Welcome Back
            </span>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Sign in to SkillConnect</h1>
            <p className="mt-2 text-sm text-gray-500">
              Continue learning, booking mentors, and tracking your progress in the community.
            </p>
          </div>

          <div className="mt-8">
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Need an account?{' '}
            <a href="/signup" className="font-semibold text-brand-blue">
              Join SkillConnect
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SignInPage;
