import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link, useParams } from "react-router-dom";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState("dark");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://anime-bakcend.onrender.com/trending")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setFilteredData(json);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data: " + error.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredData(
      query
        ? data.filter((item) =>
            item.title.english.toLowerCase().includes(query)
          )
        : data
    );
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const toggleFavorite = (anime) => {
    setFavorites((prevFavorites) =>
      prevFavorites.some((fav) => fav.id === anime.id)
        ? prevFavorites.filter((fav) => fav.id !== anime.id)
        : [...prevFavorites, anime]
    );
  };

  return (
    <div className={`App ${theme}`}>
      <header>
        <h1>Trending Anime</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      <input
        type="text"
        placeholder="Search anime..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />

      {loading && <div className="spinner">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && filteredData.length > 0 ? (
        <div className="anime-grid">
          {filteredData.map((item) => (
            <div key={item.id} className="anime-card">
              <img
                src={item.coverImage.large}
                alt={item.title.english}
                className="anime-image"
              />
              <div className="anime-details">
                <h2>{item.title.english}</h2>
                <p>
                  {item.description
                    ? item.description.slice(0, 100)
                    : "No description available."}
                  ...
                </p>
                <button
                  className={`favorite-button ${
                    favorites.some((fav) => fav.id === item.id) ? "favorited" : ""
                  }`}
                  onClick={() => toggleFavorite(item)}
                >
                  {favorites.some((fav) => fav.id === item.id)
                    ? "Unfavorite"
                    : "Favorite"}
                </button>
                <button
                  onClick={() => navigate(`/details/${item.id}`)}
                  className="details-button"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}

function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://anime-bakcend.onrender.com/anime/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setAnime(json);
        setLoading(false);
      })
      .catch(() => {
        setAnime(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!anime) {
    return <div>Error: Anime not found</div>;
  }

  return (
    <div className="details-container">
      <h1>{anime.title.english}</h1>
      <img
        src={anime.coverImage.large}
        alt={anime.title.english}
        className="details-image"
      />
      <p dangerouslySetInnerHTML={{ __html: anime.description }}></p>
      <ul>
        <li>
          <strong>Genres:</strong> {anime.genres.join(", ")}
        </li>
        <li>
          <strong>Episodes:</strong> {anime.episodes}
        </li>
        <li>
          <strong>Score:</strong> {anime.averageScore}
        </li>
      </ul>
      <Link to="/" className="back-button">
        Back to Home
      </Link>
    </div>
  );
}

function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/details/:id" element={<AnimeDetails />} />
      </Routes>
    </Router>
  );
}

export default Root;
