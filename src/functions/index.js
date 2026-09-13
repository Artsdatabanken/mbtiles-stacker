/**
 * Registry of layer modes used by the stacker.
 * Each mode corresponds to a strategy for obtaining a tile buffer for a layer.
 */
const download = require("./download");
const stack = require("./stack");

/**
 * Resolve a mode name to the function that produces source tile data.
 */
function getModeFunction(mode) {
  mode = mode || "download";
  const func = functions[mode];
  if (!func) throw new Error(`Unknown mode in config: '${mode}'`);
  return func;
}

const functions = {
  download,
  stack
};

module.exports = { getModeFunction };
