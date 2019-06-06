const stackImages = require("../stackimages");
const tileproxy = require("../tileproxy");

async function stack(config, layer, coords) {
  const r = [];
  const fetches = [];
  for (var i = 0; i < layer.layers.length; i++) {
    let sublayerName = layer.layers[i];
    const sublayer = config.json[sublayerName];
    if (!sublayer)
      throw new Error("Can't find layer definition for " + sublayerName);
    sublayer.name = sublayerName;
    sublayer.adjust = sublayer.adjust || {};
    fetches.push(download(config, sublayer, coords, i, r));
  }
  await Promise.all(fetches);
  const img = await stackImages(r);
  return img;
}

async function download(config, layer, coords, i, r) {
  const tile = await tileproxy.getTile(config, layer, coords);
  r[i] = { ...tile, ...layer };
}

module.exports = stack;
