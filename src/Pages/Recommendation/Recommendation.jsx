import React from "react";
import { useNavigate } from "react-router-dom";
import "./Recommendation.css";
import Navbar from '../../components/Navbar/Navbar'

const movies = [
  { id: 1, name: "Inception", year: 2010, director: "Christopher Nolan", summary: "A thief who enters dreams to steal secrets.", poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg" },
  { id: 2, name: "Interstellar", year: 2014, director: "Christopher Nolan", summary: "A team of explorers travel through a wormhole in space.", poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
  { id: 3, name: "The Dark Knight", year: 2008, director: "Christopher Nolan", summary: "Batman battles the Joker in Gotham City.", poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
  { id: 4, name: "Avengers: Endgame", year: 2019, director: "Anthony & Joe Russo", summary: "The Avengers assemble to undo Thanos' snap.", poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" }
];

const Recommendation = () => {
  const navigate = useNavigate();
  

  return (
    <div className="nav-container">
        <Navbar/>
        <div className="recommendation-container">
        <h2 className="page-title">Movie Recommendations</h2>
        <div className="movies-grid">
            {movies.map((movie) => (
            <div 
                key={movie.id} 
                className="movie-card"
                onClick={() => navigate(`/movie/${movie.id}`)} // Pass only the ID
            >
                <img src={movie.poster} alt={movie.name} className="movie-poster" />
                <h3 className="movie-title">{movie.name}</h3>
            </div>
            ))}
        </div>
        </div>
    </div>

  );
};

export default Recommendation;
