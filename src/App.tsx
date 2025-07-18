import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import Categories from './components/Categories';
import Recommendations from './components/Recommendations';
import Footer from './components/Footer';
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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  const auth = getAuth();

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

      setIsAuthInitialized(true); // ✅ important
    });

    return () => unsubscribe();
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
    <Router>
      <div className="font-sans bg-white text-gray-900">
        <Navbar
          isLoggedIn={isLoggedIn}
          loggedInUser={loggedInUser}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        <main className={`pt-14 md:pt-0 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'} transition-all`}>
          {isAuthInitialized ? (
            <Routes>
              <Route
                path="/admin"
                element={
                  isLoggedIn && loggedInUser?.role === 'admin' ? (
                    <AdminDashboard />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                // element={<AdminIndex />}
                path="/admin2"
              >
                {/* <Route index element={<AdminIndex />}/> */}
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
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <SearchBar
                      isLoggedIn={isLoggedIn}
                      loggedInUser={loggedInUser}
                      onLoginClick={() => setIsLoginModalOpen(true)}
                      onLogout={handleLogout}
                    />
                    <Categories />
                    <Recommendations />
                    <Footer />
                  </>
                }
              />
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
  );
};

export default App;
