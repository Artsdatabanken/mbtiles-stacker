const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

function init(app) {
  app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = { init };
