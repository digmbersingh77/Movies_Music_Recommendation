import React, { useState, useEffect } from 'react';
import './GenrePopup.css';

const GenrePopup = ({ userEmail, onClose, onSave }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const genres = ['Action', 'Adventure', 'Animation', 'Hip-Hop', 'Classical', 'Electronic'];

  // ✅ Fetch user preferences from Flask on mount
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/get_preferences/${userEmail}`)
      .then((response) => response.json())
      .then((data) => setSelectedGenres(data.preferences))
      .catch((error) => console.error("Error fetching preferences:", error));
  }, [userEmail]);

  // ✅ Toggle Genre Selection
  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // ✅ Save Preferences to Flask
  const handleSave = async () => {
    const response = await fetch("http://127.0.0.1:5000/save_preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, genres: selectedGenres }),
    });

    const data = await response.json();
    alert(data.message);  // Show confirmation
    onSave(selectedGenres);
    onClose();
    localStorage.setItem('hasSeenPopup', 'true');
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Select Your Favorite Genres</h2>
        <div className="genre-options">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`genre-btn ${selectedGenres.includes(genre) ? 'selected' : ''}`}
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
        <div className="popup-actions">
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};
export default GenrePopup;
