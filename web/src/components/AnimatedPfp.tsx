import * as React from "react";
import pfpImage from "static/images/lipfp.webp";
import { useEffect } from "react";
import { BayerDither } from "./BayerDither";

export const AnimatedPfp = () => {
  // timer effect for animating pfp
  useEffect(() => {
    let imageIdx = 0;
    let goUpward = true;
    let wait = 10;
    const images = document.querySelectorAll(".pfp-image");
    for (let image of images) image.style.display = "none";
    const interval = setInterval(() => {
      images.forEach((image) => (image.style.display = "none"));
      images[imageIdx].style.display = "block";

      if (imageIdx === images.length - 1) {
        goUpward = false;
      } else if (imageIdx === 0 && wait <= 0) {
        goUpward = true;
        wait = 10;
      } else {
        wait -= 1;
      }

      if (goUpward && wait <= 0) {
        imageIdx += 1;
      } else if (!goUpward && wait <= 0) {
        imageIdx -= 1;
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div className="pfp-image">
        <BayerDither
          pixelSize={1}
          image={pfpImage}
          height={300}
          colorB={[0, 255, 0, 255]}
          colorA={[0, 0, 0, 0]}
        />
      </div>
      <div className="pfp-image">
        <BayerDither
          pixelSize={2}
          image={pfpImage}
          height={300}
          colorB={[0, 255, 0, 255]}
          colorA={[0, 0, 0, 0]}
        />
      </div>
      <div className="pfp-image">
        <BayerDither
          pixelSize={4}
          image={pfpImage}
          height={300}
          colorB={[0, 255, 0, 255]}
          colorA={[0, 0, 0, 0]}
        />
      </div>
      <div className="pfp-image">
        <BayerDither
          pixelSize={8}
          image={pfpImage}
          height={300}
          colorB={[0, 255, 0, 255]}
          colorA={[0, 0, 0, 0]}
        />
      </div>
      <div className="pfp-image">
        <BayerDither
          pixelSize={16}
          image={pfpImage}
          height={300}
          colorB={[0, 255, 0, 255]}
          colorA={[0, 0, 0, 0]}
        />
      </div>
    </div>
  );
};
