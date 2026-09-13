/**
 * Public tile access layer.
 * This module resolves a configured layer, converts URL coordinate strings into
 * numeric values and then delegates to the proxy/cache stack to produce a tile.
 */
const tileproxy = require("./tileproxy");
const functions = require("./functions");

/**
 * Fetch a single tile for a named layer using the supplied z/x/y route values.
 */
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
