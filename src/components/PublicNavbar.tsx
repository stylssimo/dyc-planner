import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

interface PublicNavbarProps {
  transparent?: boolean;
  className?: string;
}

const PublicNavbar: React.FC<PublicNavbarProps> = ({ transparent = false, className = '' }) => {
  // Use global auth context
  const { user, setUser } = useAuth();
  
  // Animated auth state
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  
  // User dropdown state
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Email auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setShowUserDropdown(false);
  };

  const handleMyCVClick = () => {
    // Navigate to CV page or open CV modal
    window.open('/cv', '_blank');
    setShowUserDropdown(false);
  };

  const handleLandingClick = () => {
    window.location.href = '/';
  };

  const handleTripsClick = () => {
    window.open('/trips', '_blank');
  };

  const handleJobsClick = () => {
    window.open('/jobs', '_blank');
  };

  const handleSignUpClick = () => {
    setAuthMode('signup');
    setShowAuthForm(true);
  };

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthForm(true);
  };

  // Google Auth handler
  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.email!);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          picture: user.photoURL,
          role: 'user',
        });
      }

      setShowAuthForm(false);
    } catch (error) {
      console.error('Google auth failed:', error);
    }
  };

  const closeAuthForm = () => {
    setShowAuthForm(false);
    setEmail('');
    setPassword('');
    setAuthError('');
  };

  // Email auth handler
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      let userCredential;
      
      if (authMode === 'signup') {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;
      
      // Save user data to Firestore
      const userRef = doc(db, 'users', user.email!);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || email.split('@')[0],
          email: user.email,
          picture: user.photoURL || '',
          role: 'user',
          createdAt: new Date().toISOString(),
        });
      }

      setShowAuthForm(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setAuthError(error.message || 'Authentication failed. Please try again.');
    }
  };

  const navClasses = transparent 
    ? `absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-8 py-6 transition-all duration-700 ease-in-out ${showAuthForm ? 'z-0' : 'z-20'}`
    : `relative bg-white shadow-sm z-20 flex justify-between items-center px-8 py-6`;

  const textClasses = transparent ? 'text-white' : 'text-gray-900';
  const logoClasses = transparent ? 'text-white text-2xl font-bold' : 'text-blue-600 text-2xl font-bold';

  return (
    <>
      {/* Navigation */}
      <nav className={`${navClasses} ${className}`}>
        <div className={logoClasses}>
          DYC
        </div>
        <div className={`flex space-x-8 ${textClasses} items-center`}>
          <button onClick={handleLandingClick} className="hover:text-gray-300 transition-colors">Home</button>
          <button onClick={handleTripsClick} className="hover:text-gray-300 transition-colors">Trips</button>
          <button onClick={handleJobsClick} className="hover:text-gray-300 transition-colors">Jobs</button>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 hover:text-gray-300 transition-colors"
              >
                <img 
                  src={user.picture || ''} 
                  alt={user.name || ''} 
                  className="w-8 h-8 rounded-full border-2 border-current"
                />
                <span className="text-sm">{user.name?.split(' ')[0]}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* User Dropdown Menu */}
              <div className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 transition-all duration-200 transform origin-top-right ${
                showUserDropdown 
                  ? 'opacity-100 scale-100 translate-y-0' 
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}>
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleMyCVClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <span>My CV</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <button onClick={handleLoginClick} className="hover:text-gray-300 transition-colors">Login</button>
              <button onClick={handleSignUpClick} className="hover:text-gray-300 transition-colors">Sign Up</button>
            </>
          )}
        </div>
      </nav>

      {/* Animated Auth Form */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white/95 backdrop-blur-lg shadow-2xl transform transition-all duration-700 ease-in-out z-50 ${
        showAuthForm ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-8 h-full flex flex-col justify-center">
          {/* Close Button */}
          <button 
            onClick={closeAuthForm}
            className="absolute top-12 right-6 text-gray-600 hover:text-gray-800 z-50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Auth Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {authMode === 'login' ? 'Welcome back' : 'Join DYC'}
            </h2>
            <p className="text-gray-600">
              {authMode === 'login' 
                ? 'Sign in to your account' 
                : 'Create your account to start exploring'
              }
            </p>
          </div>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3 mb-6"
          >
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            <span className="font-medium">
              {authMode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with email</span>
            </div>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {authError}
            </div>
            )}

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {authMode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {/* Switch Auth Mode */}
          <div className="text-center">
            <p className="text-gray-600">
              {authMode === 'login' 
                ? "Don't have an account? " 
                : "Already have an account? "
              }
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {authMode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicNavbar;