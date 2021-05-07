const userHandler = require("../handlers/userHandler");

module.exports = [
  {
    method: "GET",
    path: "/api/v1/users",
    config: { auth: "jwt" },
    handler: userHandler.getAll,
  },
  {
    method: "GET",
    path: "/api/v1/users/{id}",
    config: { auth: "jwt" },
    handler: userHandler.getOne,
  },
  {
    method: "POST",
    path: "/api/v1/users/register",
    config: { auth: false },
    handler: userHandler.register,
  },
  {
    method: "POST",
    path: "/api/v1/users/auth",
    config: { auth: false },
    handler: userHandler.authenticate,
  },
  {
    method: "DELETE",
    path: "/api/v1/users/{id}",
    config: { auth: "jwt" },
    handler: userHandler.remove,
  },
  {
    method: "PATCH",
    path: "/api/v1/users",
    config: { auth: "jwt" },
    handler: userHandler.update,
  },
  {
    method: "PATCH",
    path: "/api/v1/users/alterarAcesso",
    config: { auth: "jwt" },
    handler: userHandler.alterarAcesso,
  },
];
