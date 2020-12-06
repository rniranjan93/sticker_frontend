const { load } = require("@tensorflow-models/deeplab");

async function loadModel(imageElement, can) {
  /* const base = "pascal";
  const quantizationBytes = 1;
  const modelUrl =
    "https://storage.googleapis.com/tfhub-tfjs-modules/tensorflow/tfjs-model/deeplab/pascal/1/default/1/model.json";
  var model = await load({
    modelUrl,
    base,
    quantizationBytes,
  });
  var { segmentationMap, width, height } = await model.segment(imageElement);
  var filerMap = new ImageData(segmentationMap, width, height);
  const canvas1 = new OffscreenCanvas(imageElement.width, imageElement.height);
  const ctx1 = canvas1.getContext("2d");*/
  const canvas2 = document.createElement("CANVAS");
  canvas2.width = imageElement.width;
  canvas2.height = imageElement.height;
  // const canvas2 = new OffscreenCanvas(imageElement.width, imageElement.height);
  const ctx2 = canvas2.getContext("2d");
  /* ctx1.putImageData(filerMap, 0, 0);
  ctx1.scale(imageElement.width / width, imageElement.width / width);
  ctx1.drawImage(canvas1, 0, 0);*/
  ctx2.drawImage(imageElement, 0, 0);
  /* var filterImage = ctx1.getImageData(
    0,
    0,
    imageElement.width,
    imageElement.height
  ).data;*/
  var realImage = ctx2.getImageData(
    0,
    0,
    imageElement.width,
    imageElement.height
  ).data;
  /*for (var l = 3; l < realImage.length; l += 4)
    if (filterImage[l - 1] === 0 && filterImage[l - 2] === 0) realImage[l] = 50;
 */ can.width =
    imageElement.width;
  can.height = imageElement.height;
  const real = can.getContext("2d");
  real.putImageData(
    new ImageData(realImage, imageElement.width, imageElement.height),
    0,
    0
  );

  // return URL.createObjectURL(canvas1.convertToBlob());
  return can.toDataURL();
}

export { loadModel };
