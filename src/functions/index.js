const download = require("./download");
const stack = require("./stack");

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
