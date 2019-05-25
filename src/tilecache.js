const Mbtiles = require("./mbtiles");

async function getTile(config, layer, coords, fallback) {
  let tile = await dbGetTile(layer.name, coords);
  if (tile) return tile;
  tile = await fallback(config, layer, coords);
  putTile(layer.name, coords, tile);
  return tile;
}

const tilepath = layerName => "./data/" + layerName + ".mbtiles";

async function dbGetTile(layerName, coords) {
  const path = tilepath(layerName);
  const db = new Mbtiles(path);
  const tile = await db.getTile(coords);
  db.close();
  return tile;
}

function putTile(layerName, coords, tile) {
  const path = tilepath(layerName);
  const db = new Mbtiles(path);
  db.writeTile(coords, tile);
}

module.exports = { getTile };
