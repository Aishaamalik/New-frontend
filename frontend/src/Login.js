import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import './Login.css';

function Login({ onLoginSuccess, onSwitchToRegister, onGithubToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Clear registration flag if it exists
      localStorage.removeItem('registering_user');
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };



  const handleGithubLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GithubAuthProvider();
    provider.addScope('repo');
    provider.addScope('user');

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      
      // Check if user data exists in localStorage, if not create it
      const existingUsername = localStorage.getItem(`user_${user.uid}_username`);
      if (!existingUsername) {
        const githubUsername = result.additionalUserInfo?.username || user.displayName || 'github_user';
        localStorage.setItem(`user_${user.uid}_username`, githubUsername);
      }
      
      if (token && onGithubToken) {
        onGithubToken(token);
      }
      
      // Clear registration flag if it exists
      localStorage.removeItem('registering_user');
      onLoginSuccess();
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email using a different sign-in method. Please use the original sign-in method.');
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      {/* Dark mode toggle */}
      <button className="dark-mode-toggle">
        🌙
      </button>

      {/* Left side - Robot illustration */}
      <div className="auth-left">
        <div className="robot-container">
          <img src="/robo.png" alt="AutoHub AI Robot" className="robot-image" />
          <div className="sparkles">
            <div className="sparkle sparkle-1">⭐</div>
            <div className="sparkle sparkle-2">✨</div>
            <div className="sparkle sparkle-3">⭐</div>
            <div className="sparkle sparkle-4">✨</div>
            <div className="sparkle sparkle-5">⭐</div>
            <div className="sparkle sparkle-6">✨</div>
            <div className="sparkle sparkle-7">⭐</div>
            <div className="sparkle sparkle-8">✨</div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="auth-right">
        <div className="auth-form">
          <div className="form-header">
            <h1>Welcome to AutoHub AI</h1>
            <p className="subtitle">Automate Your <strong>GitHub Tasks</strong> with Ease</p>
          </div>

          <form onSubmit={handleEmailLogin}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-group">
              <button type="button" className="signup-btn" onClick={onSwitchToRegister} disabled={loading}>
                Sign Up
              </button>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <div className="social-buttons">
            <button className="social-btn github-btn" onClick={handleGithubLogin} disabled={loading}>
              <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </button>
          </div>

          <p className="signup-link">
            Don't have an account? <span onClick={onSwitchToRegister}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
