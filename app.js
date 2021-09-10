// IMPORT MODULES
const Fastify = require("fastify");

function builder() {
  const fastify = Fastify({ ignoreTrailingSlash: true });
  // Homepage route? Replace later.
  fastify.get("/", async () => {
    return {
      Test: "This is working fine",
    };
  });

  // SET UP Swagger
  fastify.register(require("fastify-swagger"), {
    routePrefix: "/api/docs",
    swagger: {
      info: {
        title: "Breaking News API",
        description: "To be used as a Stream Switch Manager in Eyevinn Channel Engine. This is for reference",
        version: "0.1.0",
      },
      tags: [
        { name: "schedule", description: "Schedule related end-points" },
      ],
      securityDefinitions: {
        apiKey: {
          type: "apiKey",
          name: "x-api-key",
          in: "header",
        },
      },
    },
    exposeRoute: true,
  });

  fastify.register(require("./src/api/routes.js"), {
    prefix: "/api/v1",
  });

  fastify.register(require("fastify-cors"), {});

  fastify.ready((err) => {
    if (err) throw err;
    fastify.swagger();
  });

  return fastify;
}

module.exports = builder;
