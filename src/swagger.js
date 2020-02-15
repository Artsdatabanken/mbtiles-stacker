const { sendError } = require("micro");
const path = require("path");
const fs = require("fs").promises;

const mimeTypes = {
  jpg: "image/jpg",
  png: "image/png",
  js: "text/javascript",
  json: "application/json",
  css: "text/css"
};

const swagger = async (file = "index.html", req, res) => {
  const basePath = path.resolve("./swagger");
  const fpath = path.join(basePath, file);
  var err = null;
  const buff = await fs.readFile(fpath).catch(e => {
    err = new Error();
    err.statusCode = 404;
  });
  if (err) return sendError(req, res, err);
  const ext = file.split(".").pop();
  res.setHeader("Content-Type", mimeTypes[ext] || "text/html");
  return buff;
};

module.exports = swagger;
