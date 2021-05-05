"use strict";
require("dotenv").config();
require("./services/mongo");
const Hapi = require("@hapi/hapi");

const userRoutes = require("./routers/user");
const authRoutes = require("./routers/auth");
const validate = require("./middlewares/auth");

const JWT_SECRET = process.env.JWT_SECRET || "teste";

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"], // an array of origins or 'ignore'
      },
    },
  });

  await server.register(require("hapi-auth-jwt2"));
  server.auth.strategy("jwt", "jwt", {
    key: JWT_SECRET,
    validate,
    verifyOptions: { algorithms: ["HS256"] },
  });

  server.auth.default("jwt");

  server.route([...userRoutes, ...authRoutes]);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
