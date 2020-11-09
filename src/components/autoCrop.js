const tf = require("@tensorflow/tfjs-core");
const deeplab = require("@tensorflow-models/deeplab");

var model = null;
async function loadModel() {
  const modelName = "pascal";
  const quantizationBytes = 1;
  var model = deeplab.load({ base: modelName, quantizationBytes });
  console.log("loaded");
  return model;
}

export { loadModel, model };
