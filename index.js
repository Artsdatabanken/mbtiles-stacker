const express = require("express");
const log = require("log-less-fancy")();
const minimist = require("minimist");
const routes = require("./src/routes");
const pjson = require("./package.json");
const path = require("path");
const swagger = require("./src/swagger");

var argv = minimist(process.argv.slice(2), { alias: { p: "port" } });
if (argv._.length !== 1) {
  console.log("Usage: node index.js [options] [rootDirectory]");
  console.log("");
  console.log("rootDirectory    Data directory containing .mbtiles");
  console.log("");
  console.log("Options:");
  console.log("   -p PORT --port PORT       Set the HTTP port [8000]");
  console.log("");
  console.log("A root directory is required.");
  process.exit(1);
}

const app = express();
const config = { dataDirectory: path.resolve(argv._[0]) };
config.json = require(path.join(config.dataDirectory, "config"));

app.use(function(req, res, next) {
  res.header("X-Powered-By", "mbtiles-stacker v" + pjson.version);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With"
  );
  if (req.method === "OPTIONS") {
    return res.send(200);
  } else {
    return next();
  }
});

const port = argv.port || 8000;

routes(app, config);
swagger.init(app);

app.listen(port, () => {
  log.info("Server listening on port " + port);
});
