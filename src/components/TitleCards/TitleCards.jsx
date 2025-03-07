import React, { useRef, useEffect } from "react";
import "./TitleCards.css";

const TitleCards = ({ title, movies }) => {
  const cardsRef = useRef();

  // ✅ Horizontal Scroll on Mouse Wheel
  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    cardsRef.current.addEventListener("wheel", handleWheel);
    return () => cardsRef.current.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="title-cards">
      <h2>{title ? title : "Movies"}</h2>
      <div className="card-list" ref={cardsRef}>
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <div className="card" key={movie.id}>
              <img
                src={movie.poster || "https://via.placeholder.com/200"}
                alt={movie.title}
              />
              <p>{movie.title} ({movie.year})</p>
            </div>
          ))
        ) : (
          <p>No movies available</p>
        )}
      </div>
    </div>
  );
};

export default TitleCards;
