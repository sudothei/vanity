import * as React from "react";
import { useEffect } from "react";
import { BayerDither } from "./BayerDither";
import * as sicpWiz from "static/images/sicp-wiz.webp";
import * as spiral from "static/images/spiral.webp";

export const SicpWizard = () => {
  const smallScreen = window.innerWidth <= 700;
  const handleScroll = () => {
  const wizard = document.querySelector("#sicp-wizard");
  if (wizard != null){
      const yScrollAmt = wizard.getBoundingClientRect().top;
      const orb: HTMLDivElement | null = document.querySelector("#orb");
          if (orb != null ){
              orb.style.transform = `rotate(${yScrollAmt}deg)`;
          }
  }
  };
  useEffect(() => {
    document.addEventListener("wheel", handleScroll);
    return () => {
      document.removeEventListener("wheel", handleScroll);
    };
  });

  return (
    <div
      onScroll={handleScroll}
      id="sicp-wizard"
      style={{
        paddingBottom: smallScreen ? 20 : 50,
        paddingTop: smallScreen ? "2em" : 0,
        height: smallScreen ? 520 / 5 : 520 / 2,
        display: "flex",
        justifyContent: "center",
        placeItems: "end",
      }}
    >
      <div
        id="orb"
        style={{
          position: "relative",
          bottom: smallScreen ? -30 : -60,
          transform: `translate(${smallScreen ? -1 : -3}px, 0)`,
        }}
      >
        <BayerDither
          pixelSize={1}
          image={spiral}
          width={smallScreen ? 65 : 130}
          height={smallScreen ? 65 : 130}
          colorA={[0, 255, 0, 255]}
          colorB={[0, 0, 0, 0]}
        />
      </div>

      <div style={{ position: "absolute" }}>
        <BayerDither
          pixelSize={1}
          image={sicpWiz}
          width={smallScreen ? 800 / 4 : 800 / 2}
          height={smallScreen ? 520 / 4 : 520 / 2}
          colorA={[0, 255, 0, 255]}
          colorB={[0, 0, 0, 0]}
        />
      </div>
    </div>
  );
};
