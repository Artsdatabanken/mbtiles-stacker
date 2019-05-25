const config = require("../data/config");

module.exports = function(app, index) {
  app.get("/", res => {
    res.send(config);
  });
  app.get("*?", (req, res, next) => {
    index
      .get(decodeURIComponent(req.path), req.query)
      .then(node => {
        if (!node) return next();
        if (node.canBrowse) browse(node, req.path);
        if (!node.contentType) return next();
        res.setHeader("Content-Type", node.contentType);
        if (!node.buffer) return res.sendFile(node.physicalDir);

        res.send(node.buffer);
      })
      .catch(err => {
        next(err);
      });
  });
};
