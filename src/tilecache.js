const Mbtiles = require("./mbtiles");
const path = require("path");

const tilepath = (dataDirectory, layerName) =>
  path.join(dataDirectory, layerName + ".mbtiles");

async function getTile(config, layer, coords, fallback) {
  const path = tilepath(config.dataDirectory, layer.name);
  console.log(path);
  let tile = await dbGetTile(path, coords);
  if (tile) return tile;
  tile = await fallback(config.json, layer, coords);
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
