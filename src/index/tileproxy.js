const Jimp = require("jimp");
const fetch = require("node-fetch");
const tilecache = require("./tilecache");

async function get(layer, coords) {
  return await tilecache.get(layer, coords, download);
}

async function download(layer, coords) {
  let url = layer.url;
  url = url.replace("{z}", coords.z);
  url = url.replace("{y}", coords.y);
  url = url.replace("{x}", coords.x);
  const image = await Jimp.read(url);
  ///  const r = await fetch(url);
  return image;
}

module.exports = { get };
