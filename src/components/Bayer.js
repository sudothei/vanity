import _ from "lodash";

function bitInterleave(x, y, n) {
  x = zeroFill(x.toString(2), n).split("");
  y = zeroFill(y.toString(2), n).split("");
  return parseInt(
    _.zip(x, y)
      .map((x) => x.join(""))
      .join("")
      .toString(),
    2
  );
}

function zeroFill(number, width) {
  width -= number.toString().length;
  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join("0") + number;
  }
  return number + "";
}

function bitReverse(x, depth) {
  return parseInt(
    zeroFill(x.toString(2), depth).split("").reverse().join(""),
    2
  );
}

function bayerEntry(x, y, depth) {
  return parseInt(bitReverse(bitInterleave(x ^ y, y, depth), 2 * depth));
}

export function genBayerMatrix(depth) {
  const r = Array.from({ length: depth ** 2 }, (_, i) => i); // [0,1,2,3]
  return r.map((y) => r.map((x) => bayerEntry(x, y, depth)));
}

export function genBayerU8int8ClampedArray(depth) {
  let data = genBayerMatrix(depth);
  let bayer = [];
  data = data.flat();
  const maxAlpha = Math.max(...data);
  for (let x of data) {
    bayer.push(0);
    bayer.push(255);
    bayer.push(0);
    bayer.push((x / maxAlpha) * 255);
  }
  return new Uint8ClampedArray(bayer);
}

function tileSquareArray(xTimes, yTimes, matrix) {
  if (xTimes === Infinity) {
    return matrix;
  }
  // make horizontalStrip of array
  let horizontalStrip = [];
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
  horizontalStrip = horizontalStrip.flat();
  // multipy strip yTimes times vertically
  return Array(yTimes).fill(horizontalStrip).flat();
}

function cropSquare(width, height, original, originalLength) {
  let output = [];
  for (let i = 0; i < originalLength; i += Math.sqrt(originalLength)) {
    output.push(...original.slice(i, i + width));
  }
  output = output.slice(0, width * height);
  return output;
}

// pixelSize is used to account for if the canvas is later scaled by pixelSize
export function genBayerOverlayImage(width, height, depth, pixelSize) {
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
  oversized = new Uint8ClampedArray(oversized);

  // crop array to exact dimensions
  let overlay = cropSquare(width * 2, height * 2, oversized, oversized.length);
  overlay = new Uint8ClampedArray(overlay);

  return overlay;
}

export function genBayerOverlay(width, height, depth) {
  let bayer = genBayerMatrix(depth);
  bayer = bayer.flat();
  const bayerMax = Math.max(...bayer);
  bayer = bayer.map((x) => (x / bayerMax) * 255);
  let xTimes = Math.ceil(width / Math.sqrt(bayer.length));
  let yTimes = Math.ceil(height / Math.sqrt(bayer.length));
  bayer = tileSquareArray(xTimes, yTimes, bayer);
  bayer = cropSquare(width, height, bayer, bayer.length);
  return bayer;
}
