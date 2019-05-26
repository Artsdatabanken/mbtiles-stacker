const config = require("../data/config");
const tileproxy = require("./tileproxy");
const functions = require("./functions");

config.getModeFunction = functions.getModeFunction;

async function get(path) {
  const { layerName, coords } = decodePath(path);
  let layer = config[layerName];
  if (!layer) return null;
  layer.name = layerName;
  const tile = await tileproxy.getTile(config, layer, coords);
  if (!tile) return null;
  return {
    contentType: "image/png",
    buffer: tile.buffer
  };
}

function decodePath(path) {
  const segments = parsePath(path);
  const layerName = segments.shift();
  const z = segments.shift();
  const x = segments.shift();
  const y = segments.shift();
  const coords = { z, x, y };
  return { layerName, coords };
}

function parsePath(relativePath) {
  if (!relativePath) return [];
  const parts = relativePath.split("/");
  while (parts.length > 0 && parts[0] == "") parts.shift();
  return parts;
}

module.exports = { get };
