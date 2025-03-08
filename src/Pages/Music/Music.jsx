import React, { useState, useEffect } from "react";
import Header from "./Header";
import SongList from "./Songlist";
import GenrePopup from "./GenrePopup";
import axios from "axios";
import "./Music.css";

const CLIENT_ID = "3cfe32744c834b7e9d56637c142e009c";
const CLIENT_SECRET = "b556d723a4d548b18690a26a62550cbf";

const Music = () => {
  const [topSongs, setTopSongs] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await axios.post(
          "https://accounts.spotify.com/api/token",
          new URLSearchParams({ grant_type: "client_credentials" }),
          {
            headers: {
              Authorization: `Basic ${window.btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        setAccessToken(res.data.access_token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchSongs = async () => {
      setLoading(true);
      try {
        const [topSongsRes, newReleasesRes, playlistsRes] = await Promise.all([
          axios.get("https://api.spotify.com/v1/playlists/37i9dQZEVXbLRQDuF5jeBp", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("https://api.spotify.com/v1/browse/new-releases", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("https://api.spotify.com/v1/browse/featured-playlists", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        // Fix: Access the correct path for tracks inside the playlist
        setTopSongs(
          topSongsRes.data.tracks.items.map((item) => ({
            id: item.track?.id || "",
            title: item.track?.name || "Unknown Title",
            artist: item.track?.artists?.[0]?.name || "Unknown Artist",
            image: item.track?.album?.images?.[0]?.url || "",
          }))
        );

        setNewReleases(
          newReleasesRes.data.albums.items.map((album) => ({
            id: album.id,
            title: album.name,
            artist: album.artists[0].name,
            image: album.images[0]?.url || "",
          }))
        );

        setPlaylists(
          playlistsRes.data.playlists.items.map((playlist) => ({
            id: playlist.id,
            title: playlist.name,
            image: playlist.images[0]?.url || "",
          }))
        );
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
      setLoading(false);
    };

    fetchSongs();
  }, [accessToken]);

  return (
    <div className="music-page">
      <Header />
      {showPopup && <GenrePopup onClose={() => setShowPopup(false)} onSave={() => {}} />}
      <div className="song-section">
        <h2>🔥 Top Songs</h2>
        {loading ? <p>Loading...</p> : <SongList songs={topSongs} />}

        <h2>🎵 New Releases</h2>
        {loading ? <p>Loading...</p> : <SongList songs={newReleases} />}

        <h2>🎶 Featured Playlists</h2>
        {loading ? <p>Loading...</p> : <SongList songs={playlists} />}
      </div>
    </div>
  );
};

export default Music;
