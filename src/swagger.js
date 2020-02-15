const path = require("path");
const fs = require("fs").promises;

const mimeTypes = {
  jpg: "image/jpg",
  png: "image/png",
  js: "text/javascript",
  json: "application/json",
  css: "text/css"
};

const swagger = async (file = "index.html", res) => {
  const basePath = path.resolve("./swagger");
  const fpath = path.join(basePath, file);
  const buff = await fs.readFile(fpath);

  const ext = file.split(".").pop();
  res.setHeader("Content-Type", mimeTypes[ext] || "text/html");
  return buff;
};

module.exports = swagger;
