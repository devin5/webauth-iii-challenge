const express = require("express");
const configureMiddleware = require("./middleware/configure-middleware.js");

const authRouter = require("./Routes/authRouter.js");

const server = express();
configureMiddleware(server);

server.use("/api/auth", authRouter);

module.exports = server;
