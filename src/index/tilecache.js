const Mbtiles = require("../fileformat/mbtiles/mbtiles");

async function get(layer, coords, fallback) {
  let tile = getTile(layer, coords);
  if (tile) return tile;
  tile = await fallback(layer, coords);
  putTile(layer, coords, tile);
  return tile;
}

function getTile(layer, coords) {
  const db = new Mbtiles(layer.name + ".mbtiles");
  return db.getTile(coords);
}

function putTile(layer, coords, tile) {
  const db = new Mbtiles(layer.name + ".mbtiles");
  db.writeTile(coords, tile);
}

module.exports = { get };
