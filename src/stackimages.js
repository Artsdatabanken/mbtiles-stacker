const Jimp = require("jimp");

async function stackImages(tiles) {
  const stack = await readImages(tiles);
  adjust(stack);
  rescale(stack);
  const base = stack.images.shift();
  stack.images.forEach(img => {
    base.image.composite(img.image, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1,
      opacityDest: 1
    });
  });
  return base.image;
}

function adjust(stack) {
  for (var i = 0; i < stack.images.length; i++) {
    const tile = stack.images[i];
    const img = tile.image;
    const adjust = tile.adjust;
    if (adjust.makeTransparent) makeTransparent(img, adjust.makeTransparent);
    if (adjust.convolute) img.convolute(adjust.convolute);
    if (adjust.contrast) img.contrast(adjust.contrast);
    if (adjust.invert) img.invert();
    const color = [];
    colorArg(color, adjust, "hue");
    colorArg(color, adjust, "desaturate");
    colorArg(color, adjust, "saturate");
    colorArg(color, adjust, "lighten");
    colorArg(color, adjust, "brighten");
    colorArg(color, adjust, "darken");
    if (color.length > 0) img.color(color);
  }
}

function colorArg(out, cfg, key) {
  if (!cfg[key]) return;
  const apply = { apply: key, params: [cfg[key]] };
  out.push(apply);
}

function makeTransparent(image, transparentColor) {
  if (!transparentColor.red) return;
  const raw = image.bitmap.data;
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(
    x,
    y,
    idx
  ) {
    var red = raw[idx + 0];
    var green = raw[idx + 1];
    var blue = raw[idx + 2];
    if (red > transparentColor.red[1]) return;
    if (red < transparentColor.red[0]) return;
    if (green > transparentColor.green[1]) return;
    if (green < transparentColor.green[0]) return;
    if (blue > transparentColor.blue[1]) return;
    if (blue < transparentColor.blue[0]) return;
    raw[idx + 0] = 0;
    raw[idx + 1] = 0;
    raw[idx + 2] = 0;
    raw[idx + 3] = 0;
  });
}

function rescale(stack) {
  for (var i = 0; i < stack.images.length; i++) {
    const img = stack.images[i].image;
    if (img.bitmap.width === stack.width && img.bitmap.height === stack.height)
      continue;
    img.resize(stack.width, stack.height);
  }
}

async function readImages(tiles) {
  const r = { width: 99999, height: 99999 };
  r.images = [];
  for (var i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const image = await Jimp.read(tile.image);
    r.width = Math.min(r.width, image.bitmap.width);
    r.height = Math.min(r.height, image.bitmap.height);
    r.images[i] = { ...tile, image: image };
  }
  return r;
}

module.exports = stackImages;
