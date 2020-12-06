import canvasTxt from "canvas-txt";

var ctx = null;
var displayCanvas = null;
var flag = false;
var pastX = 0;
var pastY = 0;
var canvas = null;
var scale = 0;
var task = 0;

const draw = (x, y) => {
  if (task === 3 || task === 0) return;
  x = parseInt(x / scale);
  y = parseInt(y / scale);
  var radius = 20;
  var img = ctx.getImageData(x - radius, y - radius, radius * 2, radius * 2);
  var trans = 0;
  if (task === 1) trans = 100;
  else trans = 255;
  for (var xx = 0; xx < 2 * radius; xx += 1) {
    for (var yy = 0; yy < 2 * radius; yy += 1) {
      if ((xx - radius) ** 2 + (yy - radius) ** 2 < radius ** 2)
        img.data[(yy * radius * 2 + xx) * 4 + 3] = trans;
    }
  }
  ctx.putImageData(img, x - radius, y - radius);

  // displayCanvas.drawImage(downScaleCanvas(canvas.current, scale), 0, 0);
};

function line(x0, y0, x1, y1) {
  var dx = Math.abs(x1 - x0);
  var dy = Math.abs(y1 - y0);
  var sx = x0 < x1 ? 1 : -1;
  var sy = y0 < y1 ? 1 : -1;
  var err = dx - dy;

  while (true) {
    draw(x0, y0); // Do what you need to for this
    if (x0 === x1 && y0 === y1) break;
    var e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

const mainDraw = (x, y, can) => {
  if (task === 3 || task === 0) return;
  var rect = can.current.getBoundingClientRect();
  canvas = can;
  console.log(`${x}- ${y}`);
  if (pastX !== 0 && pastY !== 0) {
    line(x - rect.left, y - rect.top, pastX, pastY);
  }
  draw(x - rect.left, y - rect.top);
  pastX = x - rect.left;
  pastY = y - rect.top;
};

const drawText = (can, e) => {
  var rect = can.current.getBoundingClientRect();
  console.log(`x=${e.clientX} y=${e.clientY}`);
  const txt = "Lorem \nipsum \ndolo sit amet";
  ctx.lineWidth = 5;
  ctx.fillStyle = "#ff0000"; //red color text
  ctx.strokeStyle = "white";
  ctx.fill();
  var size = 30;
  canvasTxt.font = "Tahoma";
  canvasTxt.fontSize = size;
  canvasTxt.align = "center";
  canvasTxt.lineHeight = size;
  canvasTxt.debug = false; //shows debug info
  canvasTxt.justify = false;
  var width = 200;
  canvasTxt.drawText(
    ctx,
    txt,
    parseInt((e.clientX - rect.left) / scale - width / 2),
    parseInt((e.clientY - rect.top) / scale),
    // e.clientY - rect.top,
    parseInt(width),
    1
  );
};

const resetPastPoints = () => {
  pastX = 0;
  pastY = 0;
};

const setCtx = (context, dis, sca) => {
  scale = sca;
  ctx = context;
  displayCanvas = dis;
};

const setTask = (tas) => {
  task = tas;
};

const setFlag = (f) => {
  flag = f;
};

const setScale = (sca) => {
  scale = sca;
};

const getFlag = () => {
  return flag;
};

const getTask = () => {
  return task;
};

function downScaleImage(img, scale) {
  var imgCV = document.createElement("canvas");
  imgCV.width = img.width;
  imgCV.height = img.height;
  var imgCtx = imgCV.getContext("2d");
  imgCtx.drawImage(img, 0, 0);
  return downScaleCanvas(imgCV, scale);
}

// scales the canvas by (float) scale < 1
// returns a new canvas containing the scaled image.
function downScaleCanvas(cv, scale) {
  //   if (!(scale < 1) || !(scale > 0)) throw "scale must be a positive number <1 ";
  var sqScale = scale * scale; // square scale = area of source pixel within target
  var sw = cv.width; // source image width
  var sh = cv.height; // source image height
  var tw = Math.floor(sw * scale); // target image width
  var th = Math.floor(sh * scale); // target image height
  var sx = 0,
    sy = 0,
    sIndex = 0; // source x,y, index within source array
  var tx = 0,
    ty = 0,
    yIndex = 0,
    tIndex = 0; // target x,y, x,y index within target array
  var tX = 0,
    tY = 0; // rounded tx, ty
  var w = 0,
    nw = 0,
    wx = 0,
    nwx = 0,
    wy = 0,
    nwy = 0; // weight / next weight x / y
  // weight is weight of current source point within target.
  // next weight is weight of current source point within next target's point.
  var crossX = false; // does scaled px cross its current px right border ?
  var crossY = false; // does scaled px cross its current px bottom border ?
  var sBuffer = cv.getContext("2d").getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
  var tBuffer = new Float32Array(3 * tw * th); // target buffer Float32 rgb
  var sR = 0,
    sG = 0,
    sB = 0; // source's current point r,g,b
  /* untested !
    var sA = 0;  //source alpha  */

  for (sy = 0; sy < sh; sy++) {
    ty = sy * scale; // y src position within target
    tY = 0 | ty; // rounded : target pixel's y
    yIndex = 3 * tY * tw; // line index within target array
    crossY = tY != (0 | (ty + scale));
    if (crossY) {
      // if pixel is crossing botton target pixel
      wy = tY + 1 - ty; // weight of point within target pixel
      nwy = ty + scale - tY - 1; // ... within y+1 target pixel
    }
    for (sx = 0; sx < sw; sx++, sIndex += 4) {
      tx = sx * scale; // x src position within target
      tX = 0 | tx; // rounded : target pixel's x
      tIndex = yIndex + tX * 3; // target pixel index within target array
      crossX = tX != (0 | (tx + scale));
      if (crossX) {
        // if pixel is crossing target pixel's right
        wx = tX + 1 - tx; // weight of point within target pixel
        nwx = tx + scale - tX - 1; // ... within x+1 target pixel
      }
      sR = sBuffer[sIndex]; // retrieving r,g,b for curr src px.
      sG = sBuffer[sIndex + 1];
      sB = sBuffer[sIndex + 2];

      /* !! untested : handling alpha !!
               sA = sBuffer[sIndex + 3];
               if (!sA) continue;
               if (sA != 0xFF) {
                   sR = (sR * sA) >> 8;  // or use /256 instead ??
                   sG = (sG * sA) >> 8;
                   sB = (sB * sA) >> 8;
               }
            */
      if (!crossX && !crossY) {
        // pixel does not cross
        // just add components weighted by squared scale.
        tBuffer[tIndex] += sR * sqScale;
        tBuffer[tIndex + 1] += sG * sqScale;
        tBuffer[tIndex + 2] += sB * sqScale;
      } else if (crossX && !crossY) {
        // cross on X only
        w = wx * scale;
        // add weighted component for current px
        tBuffer[tIndex] += sR * w;
        tBuffer[tIndex + 1] += sG * w;
        tBuffer[tIndex + 2] += sB * w;
        // add weighted component for next (tX+1) px
        nw = nwx * scale;
        tBuffer[tIndex + 3] += sR * nw;
        tBuffer[tIndex + 4] += sG * nw;
        tBuffer[tIndex + 5] += sB * nw;
      } else if (crossY && !crossX) {
        // cross on Y only
        w = wy * scale;
        // add weighted component for current px
        tBuffer[tIndex] += sR * w;
        tBuffer[tIndex + 1] += sG * w;
        tBuffer[tIndex + 2] += sB * w;
        // add weighted component for next (tY+1) px
        nw = nwy * scale;
        tBuffer[tIndex + 3 * tw] += sR * nw;
        tBuffer[tIndex + 3 * tw + 1] += sG * nw;
        tBuffer[tIndex + 3 * tw + 2] += sB * nw;
      } else {
        // crosses both x and y : four target points involved
        // add weighted component for current px
        w = wx * wy;
        tBuffer[tIndex] += sR * w;
        tBuffer[tIndex + 1] += sG * w;
        tBuffer[tIndex + 2] += sB * w;
        // for tX + 1; tY px
        nw = nwx * wy;
        tBuffer[tIndex + 3] += sR * nw;
        tBuffer[tIndex + 4] += sG * nw;
        tBuffer[tIndex + 5] += sB * nw;
        // for tX ; tY + 1 px
        nw = wx * nwy;
        tBuffer[tIndex + 3 * tw] += sR * nw;
        tBuffer[tIndex + 3 * tw + 1] += sG * nw;
        tBuffer[tIndex + 3 * tw + 2] += sB * nw;
        // for tX + 1 ; tY +1 px
        nw = nwx * nwy;
        tBuffer[tIndex + 3 * tw + 3] += sR * nw;
        tBuffer[tIndex + 3 * tw + 4] += sG * nw;
        tBuffer[tIndex + 3 * tw + 5] += sB * nw;
      }
    } // end for sx
  } // end for sy

  // create result canvas
  var resCV = document.createElement("canvas");
  resCV.width = tw;
  resCV.height = th;
  var resCtx = resCV.getContext("2d");
  var imgRes = resCtx.getImageData(0, 0, tw, th);
  var tByteBuffer = imgRes.data;
  // convert float32 array into a UInt8Clamped Array
  var pxIndex = 0; //
  for (
    sIndex = 0, tIndex = 0;
    pxIndex < tw * th;
    sIndex += 3, tIndex += 4, pxIndex++
  ) {
    tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex]);
    tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1]);
    tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2]);
    tByteBuffer[tIndex + 3] = 255;
  }
  // writing result to canvas.
  resCtx.putImageData(imgRes, 0, 0);
  return resCV;
}

export default {
  setCtx,
  mainDraw,
  setFlag,
  resetPastPoints,
  getFlag,
  drawText,
  downScaleCanvas,
  setScale,
  setTask,
  getTask,
};
