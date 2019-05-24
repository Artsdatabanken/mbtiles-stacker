const tileproxy = require("./tileproxy");
const config = require("../config");

class Index {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  async get(path, query) {
    const segments = this.parsePath(path);
    const layerName = segments.shift();
    const layer = config[layerName];
    if (!layer) return null;
    /*  const z = parseInt(segments.shift());
    const y = parseInt(segments.shift());
    const x = parseInt(segments.shift());
   */ const z = segments.shift();
    const y = segments.shift();
    const x = segments.shift();
    const coords = { z, x, y };
    const r = [];
    const tasks = [];
    for (var i = 0; i < layer.stack.length; i++) {
      let sublayerName = layer.stack[i];
      const sublayer = config[sublayerName];
      sublayer.name = sublayerName;
      tasks.push(this.download(sublayer, coords, i, r));
    }
    const xxx = await Promise.all(tasks);
    console.log(xxx);

    const cursor = {
      physicalDir: this.rootDir,
      fileRelPath: "",
      pathSegments: segments,
      type: "directory",
      query: query,
      contentType: "image/png",
      buffer: r[0]
    };

    return cursor;
  }

  async download(layer, coords, i, r) {
    const img = await tileproxy.get(layer, coords);
    r[i] = img;
    return img;
  }

  parsePath(relativePath) {
    if (!relativePath) return [];
    const parts = relativePath.split("/");
    while (parts.length > 0 && parts[0] == "") parts.shift();
    return parts;
  }
}

module.exports = Index;
