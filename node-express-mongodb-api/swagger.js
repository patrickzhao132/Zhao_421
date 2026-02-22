const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const PORT = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Items API",
      version: "1.0.0",
      description: "Items API documented with Swagger (OpenAPI)",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [path.join(__dirname, "routes", "*.js")],
};

module.exports = swaggerJSDoc(options);