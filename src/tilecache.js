/**
 * MBTiles-backed tile cache.
 * The cache stores fetched tiles on disk so the same layer/tile pair can be
 * reused without repeatedly calling external download or stack logic.
 */
const Mbtiles = require("./mbtiles");
const path = require("path");

const tilepath = (dataDirectory, layerName) =>
  path.join(dataDirectory, layerName + ".mbtiles");

/**
 * Retrieve a tile from the local MBTiles cache; if missing, fetch it using the
 * fallback mode function and write it back for future requests.
 */
async function getTile(config, layer, coords, fallback) {
  const path = tilepath(config.dataDirectory, layer.name);
  let tile = await dbGetTile(path, coords);
  if (tile) return tile;
  tile = await fallback(config, layer, coords);
  await putTile(path, coords, tile.buffer);
  return tile;
}

async function dbGetTile(path, coords) {
  const db = new Mbtiles(path);
  const buffer = await db.getTile(coords);
  db.close();
  return buffer && { buffer: buffer };
}

async function putTile(path, coords, buffer) {
  const db = new Mbtiles(path);
  db.writeTile(coords, buffer);
}

module.exports = { getTile };
