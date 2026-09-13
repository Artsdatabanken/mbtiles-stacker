/**
 * Tile proxy layer.
 * This module is the boundary between a configured layer and the data source
 * that actually fetches or caches tiles for that layer.
 */
const tilecache = require("./tilecache");

/**
 * Resolve the tile source function for the layer mode and fetch the tile.
 * If the tile is cached in the MBTiles file it is returned directly, otherwise
 * the configured mode handler is used as a fallback.
 */
async function getTile(config, layer, coords) {
  const func = config.getModeFunction(layer.mode);
  const tile = await tilecache.getTile(config, layer, coords, func);

  return tile;
}

module.exports = { getTile };
