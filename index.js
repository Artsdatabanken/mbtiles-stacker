const { send, sendError } = require("micro");
const config = require("./data/config");
const swagger = require("./src/swagger");
const v1 = require("./v1");
const pjson = require("./package");

config.dataDirectory = "./data/";

process.on("unhandledRejection", (a, b, c) => {
  console.error("unhandledRejection", a, b, c);
});

const redirect = (location, res) => {
  res.setHeader("Location", location);
  send(res, 301, "");
};

module.exports = async (req, res) => {
  try {
    res.setHeader("X-Powered-By", "mbtiles-stacker v" + pjson.version);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Expose-Headers", "Content-Length");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Accept, Authorization, Content-Type, X-Requested-With"
    );
    console.log(req.method);
    if (req.method === "OPTIONS") return res.send(200);

    const parts = decodeURIComponent(req.url)
      .split(/\//g)
      .filter(x => x.length > 0);
    const [version, ...rest] = parts;
    console.log(version, rest);
    if (version === "swagger") return swagger(parts[1], res);

    if (version === "v1")
      return await v1(rest, res).catch(e => sendError(req, res, e));
    return redirect("/swagger/", res);
  } catch (e) {
    return e;
  }
};
