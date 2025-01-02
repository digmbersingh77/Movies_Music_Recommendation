// src/components/GenrePopup.jsx
import React, { useState, useEffect } from 'react';
import './MoviesPopup.css';

const GenrePopup = ({ onClose, onSave }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const genres = ['Pop', 'Rock', 'Jazz', 'Hip-Hop', 'Classical', 'Electronic'];

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = () => {
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
              className={`genre-btn ${
                selectedGenres.includes(genre) ? 'selected' : ''
              }`}
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
