// src/components/Header.js
import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [search, setSearch] = useState('');

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="btn">Browse</button>
        <button className="btn">Recommend</button>
        
      </div>
      <div className="header-right">
      <input
          type="text"
          className="search-bar"
          placeholder="Search for songs, artists..."
          value={search}
          onChange={handleSearchChange}
        />
        <div className="profile">
          <img src="https://via.placeholder.com/40" alt="Profile" className="profile-img" />
          <span>Username</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
