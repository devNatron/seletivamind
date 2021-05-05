const authHandler = require("../handlers/authHandler");

module.exports = [
  {
    method: "POST",
    path: "/api/v1/auth",
    handler: authHandler.authenticate,
  },
];
