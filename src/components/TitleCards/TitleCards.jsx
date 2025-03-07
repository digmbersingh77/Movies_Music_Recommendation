import React, { useEffect, useRef, useState } from 'react';
import './TitleCards.css';

const API_KEY = 'de1daa740b9235540eafe28812be129f';
const BASE_URL = 'https://api.themoviedb.org/3';

const TitleCards = ({ title, category = 'popular' }) => {
  const [movies, setMovies] = useState([]);
  const cardsRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${BASE_URL}/movie/${category}?api_key=${API_KEY}`);
        const data = await response.json();
        console.log("Fetched Movies:", data); // Debugging
        setMovies(data.results || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, [category]);

  const handleWheel = (event) => {
    event.preventDefault();
    if (cardsRef.current) {
      cardsRef.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    const cardsContainer = cardsRef.current;
    if (cardsContainer) {
      cardsContainer.addEventListener('wheel', handleWheel);
      return () => cardsContainer.removeEventListener('wheel', handleWheel);
    }
  }, []);

  return (
    <div className='title-cards'>
      <h2>{title || 'Popular Movies'}</h2>
      <div className="card-list" ref={cardsRef}>
        {movies.map((movie) => (
          <div className="card" key={movie.id}>
            <img 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/200"} 
              alt={movie.title} 
            />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
