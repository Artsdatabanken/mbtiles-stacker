const tileproxy = require("./tileproxy");
const stackImages = require("./stackimages");

async function renderStackLevel(config, layer, coords) {
  const r = [];
  const tasks = [];
  for (var i = 0; i < layer.layers.length; i++) {
    let sublayerName = layer.layers[i];
    const sublayer = config[sublayerName];
    if (!sublayer)
      throw new Error("Can't find layer definition for " + sublayerName);
    sublayer.name = sublayerName;
    sublayer.adjust = sublayer.adjust || {};
    tasks.push(download(sublayer, coords, i, r));
  }
  await Promise.all(tasks);
  const img = await stackImages(r);
  return img;
}

async function download(layer, coords, i, r) {
  const img = await tileproxy.get(layer, coords);
  r[i] = { image: img, ...layer };
}

module.exports = renderStackLevel;
