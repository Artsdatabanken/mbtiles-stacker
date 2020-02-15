const tilecache = require("./tilecache");

async function getTile(config, layer, coords) {
  const func = config.getModeFunction(layer.mode);
  const tile = await tilecache.getTile(config, layer, coords, func);

  return tile;
}

module.exports = { getTile };
