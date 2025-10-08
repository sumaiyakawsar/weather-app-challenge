import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useGeolocation } from "./hooks/useGeolocation";
import { useWeather } from "./hooks/useWeather";
import { useCompareList } from "./hooks/useCompareList";
import { useTheme } from "./hooks/useTheme";
import { metricUnits } from "./utils/units";

import Navbar from "./components/Navbar/Navbar";
import ErrorPage from "./components/pages/Error/ErrorPage";
import NoResults from "./components/pages/NoResults/NoResults";
import SearchBar from "./components/SearchBar/SearchBar";
import ResultsContainer from "./components/pages/Results/ResultsContainer";
import ResultsSkeleton from "./components/pages/Skeletons/ResultsSkeleton";
import Footer from "./components/Footer/Footer";


function App() {
  // -----------------------------
  // App states
  // -----------------------------
  const [status, setStatus] = useState("idle"); //idle |  loading | success | no-results | error
  const [initialLoadDone, setInitialLoadDone] = useState(false);  // 🛰️ Detect user location on first load
  const [displayUnits, setDisplayUnits] = useState(metricUnits);

  // -------------------------------
  // Location state (persistent)
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem("lastLocation");
    return saved ? JSON.parse(saved) : null;
  });


  // -------------------------------
  // Weather state
  const [weather] = useWeather(location, displayUnits, setStatus);

  // -------------------------------
  // Theme state
  const { theme, toggleTheme } = useTheme(weather);

  // -----------------------------
  // Geolocation hook (with toast)
  // -----------------------------
  useGeolocation(
    { location, setLocation },
    initialLoadDone,
    setInitialLoadDone,
    setStatus
  );

  // -----------------------------
  // Favorites handling
  // -----------------------------
  const [favoritesUpdated, setFavoritesUpdated] = useState(0);
  const handleFavoriteChange = () => setFavoritesUpdated((prev) => prev + 1);

  // -----------------------------
  // Compare list
  // -----------------------------
  const { compareList, addToCompare, removeFromCompare } = useCompareList();

  // -----------------------------
  // Reset location manually
  // -----------------------------
  const resetToCurrentLocation = () => {
    setStatus("loading"); 
    setLocation(null);
    setInitialLoadDone(false); // triggers geolocation + toast again
  };

  // -------------------------------
  useEffect(() => {
    const handleFavChange = () => setFavoritesUpdated(prev => prev + 1);
    window.addEventListener("favoritesUpdated", handleFavChange);
    return () => window.removeEventListener("favoritesUpdated", handleFavChange);
  }, []);


  return (
    <div className="weather-app">
      <main className="container">
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme}  
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
        />


        <Navbar
          onFavoriteSelect={(loc) => {
            setLocation(loc);
            setStatus("loading");

            if (loc) {
              toast.success(`Location set to ${loc.name}, ${loc.country}`);
            }
          }}
          favoritesUpdated={favoritesUpdated}
          onUnitsChange={setDisplayUnits}
          onSystemChange={() => setDisplayUnits((prev) => ({ ...prev }))}
          onThemeToggle={toggleTheme}
          theme={theme}
          units={displayUnits}
          compareList={compareList}
          onRemoveFromCompare={removeFromCompare}
        />

        {/* Show header only for no-results or success */}
        {status !== "error" && (
          <header className="header">
            <h1>How's the sky looking today?</h1>
            <SearchBar
              onLocationSelected={(loc, s) => {
                setStatus(s);
                if (loc) setLocation(loc);
                else setLocation(null);

                // Toast notifications
                if (s === "success" && loc) {
                  toast.success(`Location set to ${loc.name}, ${loc.country}`);
                } else if (s === "no-results") {
                  toast.info("No results found for your search.");
                } else if (s === "error") {
                  toast.error("Failed to fetch location. Try again.");
                }
              }}
              onClearSearch={resetToCurrentLocation}
            />
          </header>
        )}
        <div className="main-content">
          {status === "error" && <ErrorPage />}
          {status === "no-results" && <NoResults />}
          {status === "loading" && <ResultsSkeleton />}
          {status === "success" && weather && location && (
            <ResultsContainer
              weather={weather}
              location={location}
              units={displayUnits}
              onFavoriteChange={handleFavoriteChange} 
              favoritesUpdated={favoritesUpdated} 
              onCompare={({ place }) => addToCompare({ place, lat: location.lat, lon: location.lon })}
              compareList={compareList}
            />
          )}

        </div>
        <Footer />
      </main>

    </div>
  );
}

export default App;
