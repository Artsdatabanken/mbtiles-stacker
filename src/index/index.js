const tileproxy = require("./tileproxy");
const config = require("../../data/config");
const stackImages = require("./stackimages");
class Index {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  async get(path) {
    const segments = this.parsePath(path);
    const layerName = segments.shift();
    let layer = config[layerName];
    if (!layer) return null;
    const z = segments.shift();
    const x = segments.shift();
    const y = segments.shift();
    const coords = { z, x, y };

    const img = await this.renderLayer(config, layer, coords);
    const cursor = {
      physicalDir: this.rootDir,
      contentType: "image/png",
      buffer: img
    };
    return cursor;
  }

  async renderLayer(config, layer, coords) {
    const r = [];
    const tasks = [];
    for (var i = 0; i < layer.layers.length; i++) {
      let sublayerName = layer.layers[i];
      const sublayer = config[sublayerName];
      if (!sublayer)
        throw new Error("Can't find layer definition for " + sublayerName);
      sublayer.name = sublayerName;
      sublayer.adjust = sublayer.adjust || {};
      tasks.push(this.download(sublayer, coords, i, r));
    }
    await Promise.all(tasks);
    const img = await stackImages(r);
    return img;
  }

  async download(layer, coords, i, r) {
    const img = await tileproxy.get(layer, coords);
    r[i] = { image: img, ...layer };
  }

  parsePath(relativePath) {
    if (!relativePath) return [];
    const parts = relativePath.split("/");
    while (parts.length > 0 && parts[0] == "") parts.shift();
    return parts;
  }
}

module.exports = Index;
