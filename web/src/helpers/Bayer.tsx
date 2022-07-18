import * as _ from "lodash";

function bitInterleave(x: number, y: number, n: number): number {
  const newX: string[] = zeroFill(x.toString(2), n).split("");
  const newY: string[] = zeroFill(y.toString(2), n).split("");
  return parseInt(
    _.zip(newX, newY)
      .map((i) => i.join(""))
      .join("")
      .toString(),
    2
  );
}

function zeroFill(numberString: string, width: number): string {
  width -= numberString.length;
  if (width > 0) {
    // the /\./ thing is regex
    return new Array(width + (/\./.test(numberString) ? 2 : 1)).join("0") + numberString;
  }
  return numberString;
}

function bitReverse(x: number, depth: number): number {
  return parseInt(
    zeroFill(x.toString(2), depth).split("").reverse().join(""),
    2
  );
}

function bayerEntry(x: number, y: number, depth: number): number {
  // I have no idea why, but the 2nd parseInt is needed or else it'll return a string
  return bitReverse(bitInterleave(x ^ y, y, depth), 2 * depth);
}

export function genBayerMatrix(depth: number): number[][] {
  const r: number[] = Array.from({ length: depth ** 2 }, (_, i) => i); // [0,1,2,3]
  return r.map((y) => r.map((x) => bayerEntry(x, y, depth)));
}

export function genBayerU8int8ClampedArray(depth: number): Uint8ClampedArray {
  const data: number[][] = genBayerMatrix(depth);
  const bayer: number[] = [];
  const flatdata: number[] = data.flat();
  const maxAlpha: number = Math.max(...flatdata);
  for (let x of flatdata) {
    bayer.push(0);
    bayer.push(255);
    bayer.push(0);
    bayer.push((x / maxAlpha) * 255);
  }
  return new Uint8ClampedArray(bayer);
}

function tileSquareArray(xTimes: number, yTimes: number, matrix: number[] ): number[] {
  if (xTimes === Infinity) {
    return Array.from(matrix);
  }
  // make horizontalStrip of array
  const horizontalStrip: number[][] = [];
  // iterate over template rows
  for (let i = 0; i < matrix.length; i += Math.sqrt(matrix.length)) {
    // take row from template
    let templateSlice: number[] = matrix.slice(i, i + Math.sqrt(matrix.length));
    templateSlice = Array(...templateSlice);

    // multiply row xTimes times horizontally
    const outputRow: number[] = Array(xTimes).fill(templateSlice).flat();
    // add to horizontalStrip
    horizontalStrip.push(outputRow);
  }
  const flathorizontalStrip: number[] = horizontalStrip.flat();
  // multipy strip yTimes times vertically
  return Array(yTimes).fill(flathorizontalStrip).flat();
}

function cropSquare(width: number, height: number, original: number[], originalLength: number): number[] {
  let output: number[] = [];
  for (let i = 0; i < originalLength; i += Math.sqrt(originalLength)) {
    output.push(...original.slice(i, i + width));
  }
  output = output.slice(0, width * height);
  return output;
}

// pixelSize is used to account for if the canvas is later scaled by pixelSize
export function genBayerOverlayImage(width: number, height: number, depth: number, pixelSize: number): Uint8ClampedArray {
  // make one bayer matrix as a template
  const bayerTemplate = Array.from(genBayerU8int8ClampedArray(depth));

  // width of square template as srgb
  const templateWidth: number = depth ** 2;

  // calculate dimensions of final overlay as srgb
  const outputWidth: number = (width / pixelSize) * 2;
  const outputHeight: number = (height / pixelSize) * 2;

  const xScaleRatio: number = Math.ceil(outputWidth / templateWidth);
  const yScaleRatio: number = Math.ceil(outputHeight / templateWidth);

  // oversized bayer matrix is complete
  let oversized: number[] = tileSquareArray(xScaleRatio, yScaleRatio, bayerTemplate);
  let newoversized: number[] = Array.from(new Uint8ClampedArray(oversized));

  // crop array to exact dimensions
  const overlay: number[] = cropSquare(width * 2, height * 2, newoversized, newoversized.length);
  return new Uint8ClampedArray(overlay);
}

export function genBayerOverlay(width: number, height: number, depth: number): number[] {
  let bayer: number[][] = genBayerMatrix(depth);
  let flatbayer: number[] = bayer.flat();
  const bayerMax: number = Math.max(...flatbayer);
  flatbayer = flatbayer.map((x) => (x / bayerMax) * 255);
  let xTimes: number = Math.ceil(width / Math.sqrt(flatbayer.length));
  let yTimes: number = Math.ceil(height / Math.sqrt(flatbayer.length));
  flatbayer = tileSquareArray(xTimes, yTimes, flatbayer);
  flatbayer = cropSquare(width, height, flatbayer, flatbayer.length);
  return flatbayer;
}
