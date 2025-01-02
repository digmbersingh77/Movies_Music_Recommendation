import React, { useState, useEffect } from 'react';
import Header from './Header';
import SongList from './Songlist';
import GenrePopup from './GenrePopup';
import './Music.css';

const Music = () => {
    const [songs, setSongs] = useState([
        { id: 1, title: 'Song One', artist: 'Artist A', genre: 'Pop', image: 'https://via.placeholder.com/150' },
        { id: 2, title: 'Song Two', artist: 'Artist B', genre: 'Rock', image: 'https://via.placeholder.com/150' },
        { id: 3, title: 'Song Three', artist: 'Artist C', genre: 'Jazz', image: 'https://via.placeholder.com/150' },
        { id: 4, title: 'Song Four', artist: 'Artist D', genre: 'Hip-Hop', image: 'https://via.placeholder.com/150' },
      ]);
      const [showPopup, setShowPopup] = useState(true);
    
      useEffect(() => {
        const hasSeenPopup = localStorage.getItem('hasSeenPopup');
        if (!hasSeenPopup) {
          setShowPopup(true);
        }
      }, []);
    
      const handleSavePreferences = (selectedGenres) => {
        console.log('Selected Genres:', selectedGenres);
        // You can use selectedGenres to filter or customize the song list
      };
      return (
        <div className="app">
          <Header />
          {showPopup && (
            <GenrePopup
              onClose={() => setShowPopup(false)}
              onSave={handleSavePreferences}
            />
          )}
          <div className="song-section">
            <h2>Recommended</h2>
            <SongList songs={songs} />
            <h2>Top Songs</h2>
            <SongList songs={songs} />
            <h2>Playlists</h2>
            <SongList songs={songs} />
          </div>
        </div>
      );
}

export default Music