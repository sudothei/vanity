import * as React from "react";
import { Home } from "./routes/Home";
import { useState, useEffect } from "react";
import { LoadingBar } from "components/LoadingBar";

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoading = () => {
    setLoading(false);
  };

  useEffect(() => {
    window.addEventListener("load", handleLoading);
    return () => window.removeEventListener("load", handleLoading);
  }, []);

  return (
    <div className="App">
      {loading ? (
        <LoadingBar />
      ) : (
            <Home />
      )}
      <div className="border-corners"></div>
      <div className="border-edges"></div>
    </div>
  );
}

export default App;
