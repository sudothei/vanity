import pfpImage from "./static/images/lipfp.jpg";
import { BayerDither } from "./BayerDither";
import { useState, useEffect } from "react";
import React from "react";

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1>sudothei</h1>
        <p>This is a bayer dither</p>
        <BayerDither
          image={pfpImage}
          colorB={[0, 255, 0, 255]} // default = black
          colorA={[0, 0, 0, 0]} //default = white
          width={600} // default = image width
          height={600} //default = image height
          pixelSize={2}
        />
      </div>
      <div className="border-corners"></div>
      <div className="border-edges"></div>
    </div>
  );
}

export default App;
