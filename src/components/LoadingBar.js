import React from "react";
import { useEffect } from "react";

export const LoadingBar = () => {
  const incrementLoadingBar = () => {
    if (document.querySelector("#loading-progress").innerHTML.length < 50) {
      document.querySelector("#loading-progress").innerHTML =
        document.querySelector("#loading-progress").innerHTML + "#";
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
