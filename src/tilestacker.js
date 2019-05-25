const config = require("../data/config");
const tileproxy = require("./tileproxy");
const functions = require("./functions");

config.getModeFunction = functions.getModeFunction;

async function get(path) {
  const segments = parsePath(path);
  const layerName = segments.shift();
  let layer = config[layerName];
  if (!layer) return null;
  layer.name = layerName;
  const z = segments.shift();
  const x = segments.shift();
  const y = segments.shift();
  const coords = { z, x, y };
  const tile = await tileproxy.getTile(config, layer, coords);
  if (!tile) return null;
  const cursor = {
    contentType: "image/png",
    buffer: tile.buffer
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
