const config = require("../data/config");
const renderStackLevel = require("./renderstacklevel");

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

    const img = await renderStackLevel(config, layer, coords);
    const cursor = {
      physicalDir: this.rootDir,
      contentType: "image/png",
      buffer: img
    };
    return cursor;
  }

  parsePath(relativePath) {
    if (!relativePath) return [];
    const parts = relativePath.split("/");
    while (parts.length > 0 && parts[0] == "") parts.shift();
    return parts;
  }
}

module.exports = Index;
