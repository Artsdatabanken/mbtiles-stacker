const stackImages = require("../stackimages");
const tileproxy = require("../tileproxy");

async function stack(config, layer, coords) {
  const r = [];
  const tasks = [];
  for (var i = 0; i < layer.layers.length; i++) {
    let sublayerName = layer.layers[i];
    const sublayer = config[sublayerName];
    if (!sublayer)
      throw new Error("Can't find layer definition for " + sublayerName);
    sublayer.name = sublayerName;
    sublayer.adjust = sublayer.adjust || {};
    tasks.push(download(config, sublayer, coords, i, r));
  }
  await Promise.all(tasks);
  const img = await stackImages(r);
  return img;
}

async function download(config, layer, coords, i, r) {
  const img = await tileproxy.getTile(config, layer, coords);
  r[i] = { image: img, ...layer };
}

module.exports = stack;
