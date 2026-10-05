import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { isValidEmail, checkRateLimit, recordSubmission } from '../../../utils/validation';
import SEO from '../../../components/seo/SEO';
import { AnimatedCharactersLogin } from '@/components/ui/animated-characters-login-page';

/**
 * Login Component
 * Integrates the Premium Animated UI with robust Firebase Authentication and rate limiting.
 */
const MAX_ATTEMPTS = 3;
const COOLDOWN_MS = 30_000;
const RATE_LIMIT_KEY = 'aic_login_last_attempt';
const ATTEMPTS_KEY = 'aic_login_attempts';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper: Get attempts left before lockout
  const getRemainingAttempts = () => {
    const stored = localStorage.getItem(ATTEMPTS_KEY);
    return MAX_ATTEMPTS - (stored ? parseInt(stored, 10) : 0);
  };

  // Helper: Persist a failed login attempt
  const recordAttempt = () => {
    const stored = localStorage.getItem(ATTEMPTS_KEY);
    const attempts = stored ? parseInt(stored, 10) + 1 : 1;
    localStorage.setItem(ATTEMPTS_KEY, String(attempts));
    if (attempts >= MAX_ATTEMPTS) {
      recordSubmission(RATE_LIMIT_KEY);
    }
  };

  // Helper: Check if user is currently in cooldown period
  const isLockedOut = () => {
    const attempts = localStorage.getItem(ATTEMPTS_KEY);
    if (!attempts || parseInt(attempts, 10) < MAX_ATTEMPTS) return false;
    return !checkRateLimit(RATE_LIMIT_KEY, COOLDOWN_MS);
  };

  /**
   * Submission logic connecting the UI to Firebase
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (isLockedOut()) {
      setError('Too many failed attempts. Please wait 30 seconds.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Clean up rate limiting on successful login
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(RATE_LIMIT_KEY);
      navigate('/admin');
    } catch {
      recordAttempt();
      const remaining = getRemainingAttempts();
      if (remaining <= 0) {
        setError('Too many failed attempts. Please wait 30 seconds.');
      } else {
        setError(`Invalid credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} left.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Admin Login"
        description="Secure admin portal for Zion Baptist Church church administrators."
        url="/login"
        noIndex
      />
      <AnimatedCharactersLogin 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
        isLoading={loading}
        onLogin={handleLogin}
        isLockedOut={isLockedOut()}
      />
    </>
  );
};

export default Login;

