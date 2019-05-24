const Jimp = require("jimp");
const tilecache = require("./tilecache");

async function get(layer, coords) {
  return await tilecache.get(layer, coords, download);
}

async function download(layer, coords) {
  let url = layer.url;
  url = url.replace("{z}", coords.z);
  url = url.replace("{y}", coords.y);
  url = url.replace("{x}", coords.x);
  console.log(url);
  const image = await Jimp.read(url);
  return image;
}

module.exports = { get };
