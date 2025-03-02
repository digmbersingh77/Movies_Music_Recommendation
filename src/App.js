import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import SignIn from './Pages/SignIn/SignIn';
import Movies from './Pages/Movies/Movies';
import Music from './Pages/Music/Music';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  return (
    <Router>
      <AppWithNavigate />
    </Router>
  );
}

function AppWithNavigate() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Track the current page
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user) {
        if (location.pathname === "/SignIn") {
          navigate("/", { replace: true }); // ✅ Redirect to home after login
        }
      } else {
        if (location.pathname !== "/SignIn") {
          navigate("/SignIn", { replace: true }); // ✅ Redirect to SignIn if not logged in
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/SignIn" />} />
      {/* <Route path="/signin" element={<SignIn />} /> */}
      <Route path="/SignIn" element={user ? <Navigate to="/" /> : <SignIn />} />
      <Route path="/Movies" element={user ? <Movies /> : <Navigate to="/SignIn" />} />
      <Route path="/Music" element={user ? <Music /> : <Navigate to="/SignIn" />} />
    </Routes>
  );
}

export default App;
