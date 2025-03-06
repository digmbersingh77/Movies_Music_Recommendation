import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetails.css";

const movies = [
  { id: 1, name: "Inception", year: 2010, director: "Christopher Nolan", summary: "A thief who enters dreams to steal secrets.", poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg" },
  { id: 2, name: "Interstellar", year: 2014, director: "Christopher Nolan", summary: "A team of explorers travel through a wormhole in space.", poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
  { id: 3, name: "The Dark Knight", year: 2008, director: "Christopher Nolan", summary: "Batman battles the Joker in Gotham City.", poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
  { id: 4, name: "Avengers: Endgame", year: 2019, director: "Anthony & Joe Russo", summary: "The Avengers assemble to undo Thanos' snap.", poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" }
];

const MovieDetails = () => {
  const { id } = useParams(); // Get movie ID from URL
  const navigate = useNavigate();
  
  const movie = movies.find(m => m.id === parseInt(id)); // Find movie by ID

  if (!movie) return <h2 style={{ color: "white", textAlign: "center" }}>Movie not found!</h2>;

  return (
    <div className="movie-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>⬅ Go Back</button>
      <div className="movie-details">
        <img src={movie.poster} alt={movie.name} className="movie-poster-large" />
        <div className="movie-info">
          <h2>{movie.name}</h2>
          <p><strong>Release Year:</strong> {movie.year}</p>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Summary:</strong> {movie.summary}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
