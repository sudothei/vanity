import * as React from "react";
import { Home } from "./routes/Home";
import { LoadingBar } from "components/LoadingBar";

function App() {
  return (
    <div className="App">
      <LoadingBar />
      <Home />
      <div className="border-corners"></div>
      <div className="border-edges"></div>
    </div>
  );
}

export default App;
