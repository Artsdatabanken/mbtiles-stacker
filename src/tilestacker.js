const Jimp = require("jimp");
const config = require("../data/config");
const tileproxy = require("./tileproxy");
const functions = require("./functions");

config.getModeFunction = functions.getModeFunction;

async function get(path) {
  const segments = parsePath(path);
  const layerName = segments.shift();
  let layer = config[layerName];
  if (!layer) return null;
  const z = segments.shift();
  const x = segments.shift();
  const y = segments.shift();
  const coords = { z, x, y };
  layer.name = layerName;
  const img = await tileproxy.getTile(config, layer, coords);
  const buffer = img.getBufferAsync
    ? await img.getBufferAsync(Jimp.MIME_PNG)
    : img;
  if (!buffer) return null;
  const cursor = {
    physicalDir: this.rootDir,
    contentType: "image/png",
    buffer: buffer
  };
  return cursor;
}

function parsePath(relativePath) {
  if (!relativePath) return [];
  const parts = relativePath.split("/");
  while (parts.length > 0 && parts[0] == "") parts.shift();
  return parts;
}

module.exports = { get };
