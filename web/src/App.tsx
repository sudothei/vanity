import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./routes/Home";
import { useState, useEffect } from "react";
import { LoadingBar } from "./components/LoadingBar";

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      )}
      <div className="border-corners"></div>
      <div className="border-edges"></div>
    </div>
  );
}

export default App;
