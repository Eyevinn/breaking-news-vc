"use strict";

const fastifyServer = require("./app")({});
// Read from local .env
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// MAKE IT LISTEN
const start = async () => {
  try {
    const address = await fastifyServer.listen(
      process.env.PORT || 8001,

      process.env.HOST || "0.0.0.0"
    );

    console.log(`Breaking News API is listening at ${address}`);
  } catch (err) {
    fastifyServer.log.error(err);
    process.exit(1);
  }
};
start();
