const Jimp = require("jimp");
const tilecache = require("./tilecache");

async function get(layer, coords) {
  const func = fallbackFunction(layer.mode);
  return await tilecache.get(layer, coords, func);
}

function fallbackFunction(mode) {
  mode = mode || "download";
  const func = functions[mode];
  if (!func) throw new Error(`Unknown mode in config: '${mode}'`);
  return func;
}

const functions = {
  download: async function download(layer, coords) {
    let url = layer.url;
    url = url.replace("{z}", coords.z);
    url = url.replace("{y}", coords.y);
    url = url.replace("{x}", coords.x);
    console.log(url);
    const image = await Jimp.read(url);
    return image;
  },
  stack: async function stack(layer, coords) {}
};

module.exports = { get };
