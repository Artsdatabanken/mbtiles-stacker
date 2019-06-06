const tilestacker = require("./tilestacker");

module.exports = function(app, config) {
  app.get("/", res => {
    res.send(config);
  });
  app.get("*?", (req, res, next) => {
    tilestacker
      .get(decodeURIComponent(req.path))
      .then(node => {
        if (!node) return next();
        if (!node.contentType) return next();
        res.setHeader("Content-Type", node.contentType);
        res.send(node.buffer);
      })
      .catch(err => {
        next(err);
      });
  });
};
