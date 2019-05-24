const Jimp = require("jimp");

async function stackImages(imagearray) {
  const stack = await readImages(imagearray);
  rescale(stack);
  const base = stack.images.shift();
  stack.images.forEach(img => {
    base.composite(img, 0, 0, {
      mode: Jimp.BLEND_MULTIPLY,
      opacitySource: 0.5,
      opacityDest: 0.9
    });
  });
  return await base.getBufferAsync(Jimp.MIME_PNG);
}

function rescale(stack) {
  for (var i = 0; i < stack.images.length; i++) {
    const img = stack.images[i];
    if (img.bitmap.width === stack.width && img.bitmap.height === stack.height)
      continue;
    img.resize(stack.width, stack.height);
  }
}

async function readImages(imagearray) {
  if (imagearray.length === 1) return imagearray[0];
  const r = { width: 99999, height: 99999 };
  r.images = [];
  for (var i = 0; i < imagearray.length; i++) {
    const image = await Jimp.read(imagearray[i]);
    r.width = Math.min(r.width, image.bitmap.width);
    r.height = Math.min(r.height, image.bitmap.height);
    r.images[i] = image;
  }
  return r;
}

module.exports = stackImages;
