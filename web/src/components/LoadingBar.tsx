import * as React from "react";
import { useEffect } from "react";

export const LoadingBar = () => {
  const incrementLoadingBar = () => {
  const loadingProgress = document.querySelector("#loading-progress")
  if (loadingProgress != null) {
      if (loadingProgress.innerHTML.length < 50) {
          loadingProgress.innerHTML =
              loadingProgress.innerHTML + "#";
      }
  }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.querySelector("#loading-progress")) {
        incrementLoadingBar();
      }
    }, 1);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="ui-box"
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "1em",
          textAlign: "left",
        }}
      >
        <code>-------------------- LOADING% --------------------</code>
        <code id="loading-progress"></code>
        <code>--------------------------------------------------</code>
      </div>
    </div>
  );
};
