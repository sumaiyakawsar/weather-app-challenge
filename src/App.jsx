import { useState } from "react";
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
  const [status, setStatus] = useState("idle"); //idle |  loading | success | no-results | error
  const [initialLoadDone, setInitialLoadDone] = useState(false);  // 🛰️ Detect user location on first load

  const [location, setLocation] = useGeolocation(initialLoadDone, setInitialLoadDone, setStatus);

  const [displayUnits, setDisplayUnits] = useState(metricUnits);
  const [weather] = useWeather(location, displayUnits, setStatus);

  // Function to reset to current location
  const resetToCurrentLocation = () => {
    setStatus("loading");
    setInitialLoadDone(false); // This will trigger the geolocation again
  };
// Favourite Handling
  const [favoritesUpdated, setFavoritesUpdated] = useState(0);
  const handleFavoriteChange = () => setFavoritesUpdated((prev) => prev + 1);

// Compare 
  const { compareList, addToCompare, removeFromCompare } = useCompareList();

  // 🌗 Theme Handling (refactored into hook)
  const { theme, toggleTheme } = useTheme(weather);

  return (
    <div className="weather-app">
      <main className="container">
        <Navbar
          onFavoriteSelect={(loc) => {
            setLocation(loc);
            setStatus("loading");
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
        {/* Status-based rendering */}
        {/* Show header only for no-results or success */}
        {status !== "error" && (
          <header className="header">
            <h1>How's the sky looking today?</h1>
            <SearchBar
              onLocationSelected={(loc, s) => {
                setStatus(s);
                if (loc) setLocation(loc);
                else setLocation(null);
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
