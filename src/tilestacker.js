const tileproxy = require("./tileproxy");
const functions = require("./functions");

async function get(path, config) {
  config.getModeFunction = functions.getModeFunction;
  const { layerName, coords } = decodePath(path);
  let layer = config[layerName];
  if (!layer) return null;
  layer.name = layerName;
  const tile = await tileproxy.getTile(config, layer, coords);
  if (!tile) return null;
  tile.contentType = "image/png";
  return tile;
}

function decodePath(path) {
  const segments = parsePath(path);
  if (segments.length !== 4) return {};
  const layerName = segments.shift();
  console.log(segments);
  const coords = {
    z: readInt(segments, 0),
    x: readInt(segments, 1),
    y: readInt(segments, 2)
  };
  return { layerName, coords };
}

function readInt(segments, index) {
  const v = parseInt(segments[index]);
  if (isNaN(v)) throw new Error("Bad arguments: " + segments.join(","));
  return v;
}

function parsePath(relativePath) {
  if (!relativePath) return [];
  const parts = relativePath.split("/");
  while (parts.length > 0 && parts[0] == "") parts.shift();
  return parts;
}

module.exports = { get };
