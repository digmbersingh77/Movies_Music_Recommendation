import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Logo from "./Logo";  
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const auth = getAuth();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, [auth]);

  // Handle Sign In button click
  const handleSignInClick = () => {
    navigate("/signin");
  };

  // Handle Sign Out button click
  const handleSignOutClick = () => {
    signOut(auth)
      .then(() => {
        navigate("/signin"); // Redirect to Sign In page
      })
      .catch((error) => console.error("Sign-out error:", error));
  };

  // Handle navigation for Movies & Music
  const handleMoviesClick = () => navigate("/movies");
  const handleMusicClick = () => navigate("/music");

  return (
    <div className="App">
      <Logo />
      {user ? (
        <button onClick={handleSignOutClick} className="sign-out-button">
          Sign Out
        </button>
      ) : (
        <button onClick={handleSignInClick} className="sign-in-button">
          Sign In
        </button>
      )}
      <div className="content">
        <h1>Welcome to the Homepage</h1>
      </div>
      <div className="buttons-container">
        <button onClick={handleMoviesClick} className="button">Movies</button>
        <button onClick={handleMusicClick} className="button">Music</button>
      </div>
    </div>
  );
};

export default HomePage;
