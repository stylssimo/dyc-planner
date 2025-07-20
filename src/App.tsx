import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginModal from './components/LoginModal';
import AdminDashboard from './pages/admin/dashboard';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import Navbar from './components/Navbar';
import CreateTrip from './pages/admin/trips/pages/CreateTrip';
import AdminTrips from './pages/admin/trips';
import AdminCalendar from './pages/admin/calendar';
import AdminCons from './pages/admin/consulations';
import AdminJobs from './pages/admin/jobs';
import AdminCV from './pages/admin/cv';
import EditTrip from './pages/admin/trips/pages/EditTrip';
import ViewTrip from './pages/admin/trips/pages/ViewTrip';
import Landing from './pages/public/landing';
import Home from './pages/public/home';
import TripsPage from './pages/public/trips';
import TripDetails from './pages/public/trips/[id]';
import JobsPage from './pages/public/jobs';
import PublicNavbar from './components/PublicNavbar';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  const auth = getAuth();
  // const { user } = useAuth();
  // const location = useLocation();

  const isAdminRoute = window.location.pathname.startsWith('/admin');
  const isLandingPage = window.location.pathname === '/';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const userRef = doc(db, 'users', user.email);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            picture: user.photoURL,
            role: 'user',
          });
        }

        const role = docSnap.exists() ? docSnap.data().role : 'user';
        const userWithRole = {
          name: user.displayName,
          email: user.email,
          picture: user.photoURL,
          role,
        };

        setIsLoggedIn(true);
        setLoggedInUser(userWithRole);
      } else {
        setIsLoggedIn(false);
        setLoggedInUser(null);
      }

      // setIsAuthInitialized(true); // ✅ important
    });


    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (auth) {
      setIsAuthInitialized(true); // ✅ important
    }
    // console.log(auth, user)
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setLoggedInUser(null);
  };

  const handleGoogleLoginSuccess = async () => {
    const provider = new GoogleAuthProvider();
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
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="font-sans bg-white text-gray-900">
          {isAdminRoute && (
            <Navbar
              isLoggedIn={isLoggedIn}
              loggedInUser={loggedInUser}
              onLoginClick={() => setIsLoginModalOpen(true)}
              onLogout={handleLogout}
              isSidebarCollapsed={isSidebarCollapsed}
              setIsSidebarCollapsed={setIsSidebarCollapsed}
            />
          )}
          {!isAdminRoute && (
            <PublicNavbar 
              transparent={isLandingPage}
            />
          )}
          <main className={`${isAdminRoute ? 'pt-14 md:pt-0' : ''} ${isAdminRoute && isSidebarCollapsed ? 'md:pl-20' : isAdminRoute ? 'md:pl-64' : ''} transition-all`}>
            {isAuthInitialized ? (
              <Routes>
                {/* <Route
                  path="/admin"
                  element={
                    isLoggedIn && loggedInUser?.role === 'admin' ? (
                      <AdminDashboard />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                /> */}
                
                {/* admin routes */}
                <Route
                  path="/admin"
                >
                  <Route path='dashboard' element={<AdminDashboard />}/>
                  <Route path='consultations' element={<AdminCons />}/>
                  <Route path='trips'>
                    <Route index element={<AdminTrips />}/>
                    <Route path='create' element={<CreateTrip />}/>
                    <Route path='view/:id' element={<ViewTrip />}/>
                    <Route path='edit/:id' element={<EditTrip />}/>
                  </Route>
                  <Route path='jobs' element={<AdminJobs />}/>
                  <Route path='cv' element={<AdminCV />}/>
                  <Route path='calendar' element={<AdminCalendar />}/>
                </Route>

                {/* public routes */}
                <Route path="/">
                  <Route index element={<Landing />} />
                  <Route path="home" element={<Home />} />
                  <Route path="trips" element={<TripsPage />} />
                  <Route path="trip/:id" element={<TripDetails />} />
                  <Route path="jobs" element={<JobsPage />} />
                </Route>
              </Routes>
            ) : (
              <div className="flex justify-center items-center h-screen text-lg">Checking authentication...</div>
            )}

          </main>

          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onGoogleLoginSuccess={handleGoogleLoginSuccess}
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
