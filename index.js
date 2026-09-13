const { send, sendError } = require("micro");
const swagger = require("./src/swagger");
const v1 = require("./v1");
const pjson = require("./package");

const fs = require("fs");
const path = require("path");

/**
 * Entry point for the mbtiles-stacker service.
 * It resolves the runtime data directory, loads the layer configuration,
 * and delegates HTTP requests to the Swagger or v1 API handlers.
 */
function findDataDir() {
  if (fs.existsSync("./data")) return "./data";
  if (fs.existsSync("/data")) return "/data";
  throw new Error("Could not find ./data or /data");
}

const dataDirectory = findDataDir();
const config = JSON.parse(
  fs.readFileSync(path.join(dataDirectory, "config.json"))
);
config.dataDirectory = dataDirectory;

process.on("unhandledRejection", (a, b, c) => {
  console.error("unhandledRejection", a, b, c);
});

/**
 * Redirects the client to the Swagger UI by default.
 * This keeps the HTTP entry point simple while exposing a browsable API.
 */
const redirect = (location, res) => {
  res.setHeader("Location", location);
  send(res, 301);
};

/**
 * Main HTTP handler for the micro service.
 * It adds the standard CORS headers and routes requests either to the
 * Swagger docs or to the v1 tile API.
 */
module.exports = async (req, res) => {
  res.setHeader("X-Powered-By", "mbtiles-stacker v" + pjson.version);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Expose-Headers", "Content-Length");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With"
  );
  if (req.method === "OPTIONS") return send(res, 200);

  const r = await doit(req, res);
  return r;
};

/**
 * Splits the request URL into version and route segments, then dispatches
 * to the matching route handler.
 */
const doit = async (req, res) => {
  try {
    const parts = decodeURIComponent(req.url)
      .split(/\//g)
      .filter(x => x.length > 0);
    const [version, ...rest] = parts;
    if (version === "swagger") return await swagger(parts[1], req, res);

    if (version === "v1")
      return await v1(config, rest, res).catch(e => sendError(req, res, e));
    return redirect("/swagger/", res);
  } catch (e) {
    return e;
  }
};
