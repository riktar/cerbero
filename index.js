/**
 * @description Start
 * @author Riccardo Tartaglia
 */
"use strict";

// ENV
require("dotenv").config();
const fs = require("fs")

const AutoLoad = require("fastify-autoload");
const path = require("path");

const logger =
  process.env.LOGGER === "TRUE"
    ? process.env.DEBUG === "TRUE"
      ? { prettyPrint: true }
      : { file: "./logs/prego.log" }
    : null;

const https =
  process.env.HTTPS === "TRUE"
    ? { cert: fs.readFileSync(process.env.HTTPS_CERT), key: fs.readFileSync(process.env.HTTPS_KEY) }
    : null;

// Require the framework and instantiate it
const fastify = require("fastify")({
  logger,
  https
});

fastify.register(require("fastify-cors"), {});
fastify.register(require("./prego"), {});
fastify.register(AutoLoad, {
  dir: path.join(__dirname + "/", "plugins")
});

// Run the server
const start = async () => {
  try {
    await fastify.ready();
    await fastify.prego.start(
      process.env.PORT ? process.env.PORT : 80,
      process.env.HOST ? process.env.HOST : "0.0.0.0"
    );
  } catch (err) {
    fastify.log.error(err);
    //process.exit(1);
  }
};

// start
start();
