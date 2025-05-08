import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Already imported
import { getAuth } from 'firebase/auth';
import './Profile.css';

// List of available movie genres
const movieGenresList = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Drama', 'Documentary',
  'Family', 'Fantasy', 'Film_Noir', 'History', 'Horror', 'Mystery', 'Musical', 'Romance', 'Sci_Fi',
  'Sports', 'Thriller', 'War', 'Western'
];

// List of available music genres
const musicGenresList = [
  'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'Country', 'Reggae',
  'Blues', 'Metal', 'Folk', 'Punk', 'Soul', 'Funk', 'R&B', 'Gospel'
];

const UserProfile = () => {
  const [userData, setUserData] = useState({
    email: '',
    moviePreferences: [], // State for movie preferences
    musicPreferences: [], // State for music preferences
  });
  const [newMoviePref, setNewMoviePref] = useState('');
  const [newMusicPref, setNewMusicPref] = useState(''); // State for the selected new music genre
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Already initialized
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/signin');
          return;
        }

        const token = await user.getIdToken();
        // Fetching preferences for both movies and music from a single endpoint
        const prefsRes = await fetch(`http://127.0.0.1:5000/get_preferences/${encodeURIComponent(user.email)}`, {
        // Ensure email is properly encoded if it contains special characters
        const encodedEmail = encodeURIComponent(user.email);
        const prefsRes = await fetch(`http://127.0.0.1:5000/get_preferences/${encodedEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const prefsMusicRes = await fetch(`http://127.0.0.1:5000/get_music_preferences/${encodeURIComponent(user.email)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!prefsRes.ok) throw new Error('Failed to fetch preferences');
        if (!prefsMusicRes.ok) throw new Error('Failed to fetch preferences');
        if (!prefsRes.ok) {
            // Attempt to read error message from response if available
            const errorBody = await prefsRes.text(); // or .json() if backend sends JSON errors
            console.error("Fetch error response:", errorBody);
            throw new Error(`Failed to fetch preferences: ${prefsRes.statusText}`);
        }


        const prefsData = await prefsRes.json();
        const prefsMusicData = await prefsMusicRes.json();
        setUserData({
          email: user.email,
          // Provide default empty arrays if keys are missing or null
          moviePreferences: prefsData.preferences || [],
          musicPreferences: prefsMusicData.music_preferences || [],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to fetch preferences. ${error.message || ''}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [auth, navigate]); // Dependencies seem correct

  // Function to update movie preferences on the backend
  const updateMoviePreferences = async (updatedPrefs) => {
    try {
      setIsLoading(true); // Optionally show loading state during update
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in"); // Guard clause

      const token = await user.getIdToken();
      const response = await fetch(`http://127.0.0.1:5000/save_preferences`, { // Endpoint for movie preferences
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: user.email, genres: updatedPrefs }),
      });

      if (!response.ok) throw new Error('Update failed for movie preferences');
      if (!response.ok) {
          const errorBody = await response.text();
          console.error("Update error response:", errorBody);
          throw new Error(`Update failed: ${response.statusText}`);
      }


      setUserData((prev) => ({ ...prev, moviePreferences: updatedPrefs }));
      setNewMoviePref(''); // Clear selection after successful add
      setError(''); // Clear previous errors on success
    } catch (error) {
      console.error('Error updating movie preferences:', error.message);
      // Optionally, set an error message for the user
      console.error('Error updating movie preferences:', error);
      setError(`Failed to update movie preferences. ${error.message || ''}`);
    } finally {
       setIsLoading(false); // Hide loading state
    }
  };

  // Function to update music preferences on the backend
  const updateMusicPreferences = async (updatedPrefs) => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const response = await fetch(`http://127.0.0.1:5000/save_music_preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: user.email, genres: updatedPrefs }), // Sending music genres
      });
        setIsLoading(true);
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");

        const token = await user.getIdToken();
        const response = await fetch(`http://127.0.0.1:5000/save_music_preferences`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email: user.email, genres: updatedPrefs }),
        });

      if (!response.ok) throw new Error('Update failed for music preferences');
        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Update error response:", errorBody);
            throw new Error(`Update failed: ${response.statusText}`);
        }

      setUserData((prev) => ({ ...prev, musicPreferences: updatedPrefs })); 
      setNewMusicPref(''); 
        setUserData((prev) => ({ ...prev, musicPreferences: updatedPrefs }));
        setNewMusicPref('');
        setError('');
    } catch (error) {
        console.error('Error updating music preferences:', error);
        setError(`Failed to update music preferences. ${error.message || ''}`);
    } finally {
        setIsLoading(false);
    }
  };

  // Generic function to add a preference (either movie or music)
  // Generic add function
  const addPreference = (type, genre) => {
    if (!genre) return; // Do nothing if no genre is selected

    // Check if the genre already exists in the respective preferences list
    if (userData[`${type}Preferences`].includes(genre)) {
        console.warn(`${type} preference '${genre}' already exists.`);
        return;
    }

    const updatedPrefs = [...userData[`${type}Preferences`], genre];

    if (type === 'movie') {
      updateMoviePreferences(updatedPrefs);
    } else if (type === 'music') {
      updateMusicPreferences(updatedPrefs); // Call specific update function for music
    }
    if (!genre) {
        setError(`Please select a ${type} genre to add.`);
        return; // Don't proceed if no genre is selected
    }
    // Use the correct state property based on type
    const currentPrefs = userData[`${type}Preferences`];
    if (currentPrefs.includes(genre)) {
        setError(`${genre} is already in your ${type} preferences.`);
        return; // Don't add duplicates
    }

    const updatedPrefs = [...currentPrefs, genre];

    if (type === 'movie') {
        updateMoviePreferences(updatedPrefs);
    } else if (type === 'music') {
        updateMusicPreferences(updatedPrefs);
    }
  };

  // Generic function to remove a preference (either movie or music)
  // Generic remove function
  const removePreference = (type, genre) => {
    // Use the correct state property based on type
    const currentPrefs = userData[`${type}Preferences`];
    const updatedPrefs = currentPrefs.filter(g => g !== genre);

    if (type === 'movie') {
        updateMoviePreferences(updatedPrefs);
    } else if (type === 'music') {
        updateMusicPreferences(updatedPrefs);
    }
  };

  // Handle loading state more explicitly
  if (isLoading && !userData.email) { // Show loading only on initial fetch
     return <div className="loading">Loading profile...</div>;
  }


  return (
    <div className="user-profile">
      <div className="header-profile">
        <button onClick={handleGoBack}>Go Back</button>
        <h1>User Profile</h1>
      </div>
      <h1>User Profile</h1>
      {/* --- Button to go Home --- */}
      <button onClick={() => navigate('/')} className="home-button">
          Go to Home
      </button>
      {/* --- Display Error Messages --- */}
      {error && <p className="error-message">{error}</p>}
      <div className='profile-div'>
       {/* --- Display Loading state during updates --- */}
      {isLoading && <p className="loading-message">Updating...</p>}

      <div className="profile-section">
        <h2><span>Email:</span> {userData.email}</h2>

        {/* Movie Preferences Section */}
        {/* --- Movie Preferences Section --- */}
        <div className="preferences">
          <h3>Movie Genre Preferences</h3>
          <ul>
            {userData.moviePreferences.map((genre, index) => (
              <li key={index}>
                {genre} <button onClick={() => removePreference('movie', genre)}>Remove</button>
              </li>
            ))}
          </ul>
          <select value={newMoviePref} onChange={(e) => setNewMoviePref(e.target.value)}>
            <option value="">Select a movie genre</option>
            {movieGenresList.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
          </select>
          <button onClick={() => addPreference('movie', newMoviePref)} disabled={!newMoviePref}>Add Movie Genre</button>
          {userData.moviePreferences.length > 0 ? (
             <ul>
               {userData.moviePreferences.map((genre) => ( // Use genre for key if unique
                 <li key={`movie-${genre}`}>
                   {genre}
                   <button
                      onClick={() => removePreference('movie', genre)}
                      disabled={isLoading} // Disable button during updates
                      className="remove-button"
                   >
                     Remove
                   </button>
                 </li>
               ))}
             </ul>
           ) : (
             <p>No movie preferences added yet.</p>
           )}
          <div className="add-preference">
            <select
                value={newMoviePref}
                onChange={(e) => {
                    setNewMoviePref(e.target.value);
                    setError(''); // Clear error when user changes selection
                }}
                disabled={isLoading}
            >
              <option value="">Select a movie genre</option>
              {movieGenresList
                .filter(genre => !userData.moviePreferences.includes(genre)) // Filter out already selected genres
                .map((genre) => <option key={genre} value={genre}>{genre}</option>)
               }
            </select>
            <button
                onClick={() => addPreference('movie', newMoviePref)}
                disabled={!newMoviePref || isLoading} // Also disable during loading
                className="add-button"
             >
                 Add Genre
            </button>
          </div>
        </div>

        {/* Music Preferences Section - mirrors the movie preferences section */}
        {/* --- Music Preferences Section --- */}
        <div className="preferences">
          <h3>Music Genre Preferences</h3>
          <ul>
            {userData.musicPreferences.map((genre, index) => (
              <li key={index}>
                {genre} <button onClick={() => removePreference('music', genre)}>Remove</button>
              </li>
            ))}
          </ul>
          <select value={newMusicPref} onChange={(e) => setNewMusicPref(e.target.value)}>
            <option value="">Select a music genre</option>
            {musicGenresList.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
          </select>
          <button onClick={() => addPreference('music', newMusicPref)} disabled={!newMusicPref}>Add Music Genre</button>
        </div>
      </div>
           {userData.musicPreferences.length > 0 ? (
             <ul>
                {userData.musicPreferences.map((genre) => ( // Use genre for key
                    <li key={`music-${genre}`}>
                        {genre}
                        <button
                           onClick={() => removePreference('music', genre)}
                           disabled={isLoading}
                           className="remove-button"
                        >
                            Remove
                        </button>
                    </li>
                ))}
             </ul>
            ) : (
             <p>No music preferences added yet.</p>
            )}
          <div className="add-preference">
            <select
                value={newMusicPref}
                onChange={(e) => {
                    setNewMusicPref(e.target.value);
                    setError('');
                 }}
                disabled={isLoading}
            >
              <option value="">Select a music genre</option>
               {musicGenresList
                  .filter(genre => !userData.musicPreferences.includes(genre)) // Filter out already selected
                  .map((genre) => <option key={genre} value={genre}>{genre}</option>)
               }
            </select>
            <button
                onClick={() => addPreference('music', newMusicPref)}
                disabled={!newMusicPref || isLoading}
                className="add-button"
            >
                Add Genre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;