const log = require("log-less-fancy")();
const fetch = require("node-fetch");

async function download(config, layer, coords) {
  let url = layer.url;
  url = url.replace("{z}", coords.z);
  url = url.replace("{y}", coords.y);
  url = url.replace("{x}", coords.x);
  log.info(url);
  return { buffer: await fetchImage(url) };
}

async function fetchImage(url) {
  const response = await fetch(url);

  if (response.status !== 200) {
    const err = new Error();
    err.status = response.status;
    err.message = url + ": " + response.statusText;
    throw err;
  }
  const buff = await response.buffer();
  return buff;
}

module.exports = download;
