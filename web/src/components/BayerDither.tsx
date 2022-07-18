import * as React from "react";
import { genBayerOverlay } from "helpers/Bayer";
import { useRef, useEffect } from "react";

interface BayerDitherProps {
    width?: number,
    height?: number,
    pixelSize: number,
    image: any,
    depth: number
    colorA: number[],
    colorB: number[]
}

export const BayerDither = (props: BayerDitherProps) => {
  const canvasRef: React.RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
  const width: number = props.width ? props.width : 255;
  const height: number = props.height ? props.height : 255;
  const pixelSize: number = props.pixelSize > 0 ? props.pixelSize : 1;

  useEffect(() => {
    // make source image
    const sourceImg: HTMLImageElement = new Image();
    sourceImg.crossOrigin = "";
    sourceImg.src = props.image.default;
    sourceImg.onload = function () {
      // make dummy canvas
      const dummyCanvas = document.createElement("canvas");
      const dummyCtx = dummyCanvas.getContext("2d");
      dummyCtx!.imageSmoothingEnabled = false;
      dummyCanvas.width = Math.floor(width / pixelSize);
      dummyCanvas.height = Math.floor(height / pixelSize);

      // make ctx
      const ctx = canvasRef.current!.getContext("2d");
      ctx!.imageSmoothingEnabled = false;

      // generate overlay
      const overlay = genBayerOverlay(
        Math.floor(width / pixelSize),
        Math.floor(height / pixelSize),
        props.depth
      );

      // put scaled down image to canvas
          dummyCtx!.drawImage(
                  sourceImg,
                  0,
                  0,
                  Math.floor(width / pixelSize),
                  Math.floor(height / pixelSize)
                  );

      // get scaled down image pixels
      const imageData = dummyCtx!.getImageData(
        0,
        0,
        Math.floor(width / pixelSize),
        Math.floor(height / pixelSize)
      );

      // loop through pixels, modifying according to bayer overlay
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
      // scale visible canvas
      // put Uint8ClampedArray to dummy canvas
      ctx!.clearRect(0, 0, width, height);
      dummyCtx!.putImageData(imageData, 0, 0);
      // put dummy canvas to visible canvas
      ctx!.drawImage(
        dummyCtx!.canvas,
        0,
        0,
        Math.floor(width / pixelSize),
        Math.floor(height / pixelSize),
        0,
        0,
        width,
        height
      );
    };
  }, [
    canvasRef,
    height,
    width,
    props.image,
    props.height,
    props.width,
    props.depth,
    props.pixelSize,
    pixelSize,
    props.colorA,
    props.colorB,
  ]);

  genBayerOverlay(width, height, props.depth);

  return (
    <div>
      <canvas width={width} height={height} ref={canvasRef} />
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
