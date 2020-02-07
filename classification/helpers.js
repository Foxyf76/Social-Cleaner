const { loadImage, createCanvas, Image } = require('canvas');
const axios = require('axios');
const Jimp = require('jimp');
const sharp = require('sharp');

// for converting URLs into tensor objects
const getTensor3dObject = async imageURL => {
  let req = await axios.get(imageURL, {
    responseType: 'arraybuffer'
  });
  // 3 = jpg, 4 = png
  return tf.node.decodeJpeg(req.data, 3);
};

// for creating HTMLElements from base64 image (to then be converted to tensor)
const createCanvasImage = async base64Image => {
  let image = await loadImage(base64Image);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
};

// takes the max scores from inputted scores tensor object
const calculateMaxScores = (scores, numBoxes, numClasses) => {
  const maxes = [];
  const classes = [];
  for (let i = 0; i < numBoxes; i++) {
    let max = Number.MIN_VALUE;
    let index = -1;
    for (let j = 0; j < numClasses; j++) {
      if (scores[i * numClasses + j] > max) {
        max = scores[i * numClasses + j];
        index = j;
      }
    }
    maxes[i] = max;
    classes[i] = index;
  }
  return [maxes, classes];
};

// returns score, bbox coordinates and labels
const buildDetectedObjects = (
  width,
  height,
  boxes,
  scores,
  indexes,
  classes
) => {
  const count = indexes.length;
  const objects = [];
  for (let i = 0; i < count; i++) {
    const bbox = [];
    for (let j = 0; j < 4; j++) {
      bbox[j] = boxes[indexes[i] * 4 + j];
    }
    const minY = bbox[0] * height;
    const minX = bbox[1] * width;
    const maxY = bbox[2] * height;
    const maxX = bbox[3] * width;
    bbox[0] = minX;
    bbox[1] = minY;
    bbox[2] = maxX - minX;
    bbox[3] = maxY - minY;
    objects.push({
      bbox: bbox,
      class: 'middle_finger',
      score: scores[indexes[i]]
    });
  }
  return objects;
};

const drawBoundingBox = (canvas, coordinates) => {
  let bboxCanvas = canvas;
  const ctx = bboxCanvas.getContext('2d');

  coordinates.forEach(coord => {
    ctx.beginPath();
    ctx.rect(coord.bbox[0], coord.bbox[1], coord.bbox[2], coord.bbox[3]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.font = '20px serif';
    ctx.fillStyle = 'red';
    ctx.fillText(
      Math.round(coord.score) * 100 + '% Middle Finger',
      coord.bbox[0],
      coord.bbox[1] - 10
    );
  });

  return bboxCanvas.toDataURL();
};

// https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const boundingBoxesToImage = async (boxArray, image) => {
  let images = [];
  let base64 = image.toDataURL();
  let base64Stripped = base64.split(',')[1];
  let buff = Buffer.from(base64Stripped, 'base64');

  await asyncForEach(boxArray, async boxes => {
    let imageBuffer = await sharp(buff)
      .extract({
        // need to check width and height
        left: boxes[0],
        top: boxes[1],
        width: boxes[2] - 20,
        height: boxes[3] - 20
      })
      .toBuffer();
    // append data header to base64 string
    let image = 'data:image/png;base64,' + imageBuffer.toString('base64');
    images.push({ image: image, bbox: boxes });
  });

  return images;
};

module.exports = {
  getTensor3dObject,
  createCanvasImage,
  calculateMaxScores,
  buildDetectedObjects,
  drawBoundingBox,
  boundingBoxesToImage,
  asyncForEach
};