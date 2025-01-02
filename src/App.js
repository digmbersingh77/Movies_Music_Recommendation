import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, navigate to HomePage if the current path is SignIn
        if (window.location.pathname === "/SignIn") {
          navigate('/HomePage', { replace: true });
        }
      } else {
        // User is not logged in, navigate to SignIn if the current path is not SignIn
        if (window.location.pathname !== "/SignIn") {
          navigate('/SignIn', { replace: true }); // Changed to navigate to SignIn when user is not logged in
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/Movies" element={<Movies />} />
      <Route path="/Music" element={<Music />} />
    </Routes>
  );
}

export default App;
