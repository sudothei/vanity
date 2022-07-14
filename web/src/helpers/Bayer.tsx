import _ from "lodash";

function bitInterleave(x: number, y: number, n: number): number {
  const newX = zeroFill(x.toString(2), n).split("");
  const newY = zeroFill(y.toString(2), n).split("");
  return parseInt(
    _.zip(newX, newY)
      .map((i) => i.join(""))
      .join("")
      .toString(),
    2
  );
}

function zeroFill(number: string, width: number): string {
  width -= number.length;
  if (width > 0) {
    // the /\./ thing is regex
    return new Array(width + (/\./.test(number) ? 2 : 1)).join("0") + number;
  }
  return number;
}

function bitReverse(x: number, depth: number): number {
  return parseInt(
    zeroFill(x.toString(2), depth).split("").reverse().join(""),
    2
  );
}

function bayerEntry(x: number, y: number, depth: number): number {
  // I have no idea why, but the 2nd parseInt is needed or else it'll return a string
  return parseInt(bitReverse(bitInterleave(x ^ y, y, depth), 2 * depth).toString());
}

export function genBayerMatrix(depth: number): number[][] {
  const r = Array.from({ length: depth ** 2 }, (_, i) => i); // [0,1,2,3]
  return r.map((y) => r.map((x) => bayerEntry(x, y, depth)));
}

export function genBayerU8int8ClampedArray(depth: number) {
  const data: number[][] = genBayerMatrix(depth);
  const bayer: number[] = [];
  const flatdata = data.flat();
  const maxAlpha = Math.max(...flatdata);
  for (let x of flatdata) {
    bayer.push(0);
    bayer.push(255);
    bayer.push(0);
    bayer.push((x / maxAlpha) * 255);
  }
  return new Uint8ClampedArray(bayer);
}

function tileSquareArray(xTimes: number, yTimes: number, matrix ): number[] {
  if (xTimes === Infinity) {
    return matrix;
  }
  // make horizontalStrip of array
  const horizontalStrip: number[][] = [];
  // iterate over template rows
  for (let i = 0; i < matrix.length; i += Math.sqrt(matrix.length)) {
    // take row from template
    let templateSlice = matrix.slice(i, i + Math.sqrt(matrix.length));
    templateSlice = Array(...templateSlice);

    // multiply row xTimes times horizontally
    const outputRow = Array(xTimes).fill(templateSlice).flat();
    // add to horizontalStrip
    horizontalStrip.push(outputRow);
  }
  const flathorizontalStrip = horizontalStrip.flat();
  // multipy strip yTimes times vertically
  return Array(yTimes).fill(flathorizontalStrip).flat();
}

function cropSquare(width: number, height: number, original, originalLength: number) {
  let output: number[] = [];
  for (let i = 0; i < originalLength; i += Math.sqrt(originalLength)) {
    output.push(...original.slice(i, i + width));
  }
  output = output.slice(0, width * height);
  return output;
}

// pixelSize is used to account for if the canvas is later scaled by pixelSize
export function genBayerOverlayImage(width: number, height: number, depth: number, pixelSize: number) {
  // make one bayer matrix as a template
  const bayerTemplate = genBayerU8int8ClampedArray(depth);

  // width of square template as srgb
  const templateWidth = depth ** 2;

  // calculate dimensions of final overlay as srgb
  const outputWidth = (width / pixelSize) * 2;
  const outputHeight = (height / pixelSize) * 2;

  const xScaleRatio = Math.ceil(outputWidth / templateWidth);
  const yScaleRatio = Math.ceil(outputHeight / templateWidth);

  // oversized bayer matrix is complete
  let oversized = tileSquareArray(xScaleRatio, yScaleRatio, bayerTemplate);
  let newoversized = new Uint8ClampedArray(oversized);

  // crop array to exact dimensions
  const overlay = cropSquare(width * 2, height * 2, newoversized, newoversized.length);
  return new Uint8ClampedArray(overlay);
}

export function genBayerOverlay(width: number, height: number, depth: number): number[] {
  let bayer: number[][] = genBayerMatrix(depth);
  let flatbayer: number[] = bayer.flat();
  const bayerMax: number = Math.max(...flatbayer);
  flatbayer = flatbayer.map((x) => (x / bayerMax) * 255);
  let xTimes = Math.ceil(width / Math.sqrt(flatbayer.length));
  let yTimes = Math.ceil(height / Math.sqrt(flatbayer.length));
  flatbayer = tileSquareArray(xTimes, yTimes, flatbayer);
  flatbayer = cropSquare(width, height, flatbayer, flatbayer.length);
  return flatbayer;
}
