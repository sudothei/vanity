import React from "react";
import { genBayerOverlay } from "./Bayer";
import { useState, useRef, useEffect } from "react";

export const BayerDither = (props) => {
  const pfpCanvas = useRef(null);
  const [width, setWidth] = useState(255);
  const [height, setHeight] = useState(255);
  const [pixelSize, setPixelSize] = useState(1);

  useEffect(() => {
    setPixelSize(Math.sqrt(props.pixelSize));

    // make dummy canvas
    const dummyCanvas = document.createElement("canvas");
    const dummyCtx = dummyCanvas.getContext("2d");
    dummyCanvas.width = width;
    dummyCanvas.height = height;
    dummyCtx.scale(1 / pixelSize, 1 / pixelSize);

    // make ctx
    const ctx = pfpCanvas.current.getContext("2d");
    ctx.mozImageSmoothingEnabled = false; // firefox
    ctx.imageSmoothingEnabled = false;

    // generate overlay
    const overlay = genBayerOverlay(
      width / pixelSize,
      height / pixelSize,
      props.depth,
      pixelSize
    );

    // make source image
    const sourceImg = new Image();
    sourceImg.src = props.image;
    sourceImg.onload = function () {
      // set width and height state if unspecified
      setWidth(props.width ? props.width : sourceImg.width);
      setHeight(props.height ? props.height : sourceImg.height);

      // put scaled down image to canvas
      dummyCtx.drawImage(
        sourceImg,
        0,
        0,
        width / pixelSize,
        height / pixelSize
      );
      // get scaled down image pixels
      const imageData = dummyCtx.getImageData(
        0,
        0,
        width / pixelSize,
        height / pixelSize
      );
      // iterate over them, modifying according to bayer overlay
      let b = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        b++;
        const avg =
          imageData.data.slice(i, i + 3).reduce((x, sum) => sum + x) / 3;
        if (avg >= overlay[b]) {
          imageData.data[i] = props.colorA[0];
          imageData.data[i + 1] = props.colorA[1];
          imageData.data[i + 2] = props.colorA[2];
          imageData.data[i + 3] = props.colorA[3];
        } else {
          imageData.data[i] = props.colorB[0];
          imageData.data[i + 1] = props.colorB[1];
          imageData.data[i + 2] = props.colorB[2];
          imageData.data[i + 3] = props.colorB[3];
        }
      }

      // idk why I need to do this since I never drew to this canvas
      // but if I don't it leaves artifacts
      ctx.clearRect(0, 0, width / pixelSize, height / pixelSize);
      // scale visible canvas
      ctx.scale(pixelSize, pixelSize);
      // put Uint8ClampedArray to dummy canvas
      dummyCtx.putImageData(imageData, 0, 0);
      // put dummy canvas to visible canvas
      ctx.drawImage(
        dummyCtx.canvas,
        0,
        0,
        width / pixelSize,
        height / pixelSize
      );
    };
  }, [
    pfpCanvas,
    height,
    width,
    props.image,
    props.height,
    props.width,
    props.depth,
    pixelSize,
    props.colorA,
    props.colorB,
    props.pixelSize,
  ]);

  genBayerOverlay(width, height, props.depth);

  return (
    <div>
      <canvas width={width} height={height} ref={pfpCanvas} />
    </div>
  );
};

BayerDither.defaultProps = {
  depth: 8,
  pixelSize: 2,
  colorA: [255, 255, 255, 255],
  colorB: [0, 0, 0, 255],
  invert: false,
  threshold: 0,
};
