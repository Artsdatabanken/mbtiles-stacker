const Mbtiles = require("./mbtiles");

async function get(layer, coords, fallback) {
  let tile = await getTile(layer, coords);
  if (tile) return tile;
  tile = await fallback(layer, coords);
  putTile(layer, coords, tile);
  return tile;
}

const tilepath = layer => "./data/" + layer.name + ".mbtiles";

async function getTile(layer, coords) {
  const path = tilepath(layer);
  const db = new Mbtiles(path);
  const tile = await db.getTile(coords);
  db.close();
  return tile;
}

function putTile(layer, coords, tile) {
  const path = tilepath(layer);
  const db = new Mbtiles(path);
  db.writeTile(coords, tile);
}

module.exports = { get };
