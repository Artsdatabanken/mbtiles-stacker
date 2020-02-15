const tileproxy = require("./tileproxy");
const functions = require("./functions");

async function get(config, layerName, z, x, y) {
  config.getModeFunction = functions.getModeFunction;
  let layer = config[layerName];
  if (!layer) return null;
  layer.name = layerName;
  const coords = parseCoords(z, x, y);
  const tile = await tileproxy.getTile(config, layer, coords);

  if (!tile) return null;
  tile.contentType = "image/png";
  return tile;
}

function parseCoords(z, x, y) {
  const coords = {
    z: readInt(z),
    x: readInt(x),
    y: readInt(y)
  };
  return coords;
}

function readInt(str) {
  const v = parseInt(str);
  if (isNaN(v)) throw new Error("Bad arguments: " + segments.join(","));
  return v;
}

module.exports = { get };
