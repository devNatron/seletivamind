const user = (user, acesso, token) => {
  payload = {
    type: "users",
    attributes: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      acesso,
    },
    links: {
      self: `/api/v1/users/${user.id}`,
    },
  };

  if (token) payload.token = token;

  return payload;
};

module.exports = {
  user,
};
