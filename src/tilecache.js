const Mbtiles = require("./mbtiles");

async function getTile(config, layer, coords, fallback) {
  let tile = await dbGetTile(layer.name, coords);
  if (tile) return tile;
  tile = await fallback(config, layer, coords);
  await putTile(layer.name, coords, tile.buffer);
  return tile;
}

const tilepath = layerName => "./data/" + layerName + ".mbtiles";

async function dbGetTile(layerName, coords) {
  const path = tilepath(layerName);
  const db = new Mbtiles(path);
  const buffer = await db.getTile(coords);
  db.close();
  return buffer && { buffer: buffer };
}

async function putTile(layerName, coords, buffer) {
  const path = tilepath(layerName);
  const db = new Mbtiles(path);
  db.writeTile(coords, buffer);
}

module.exports = { getTile };
