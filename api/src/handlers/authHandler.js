const UserModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const transformer = require("../utils/responseTransformer");

const JWT_SECRET = process.env.JWT_SECRET || "teste";

const authenticate = async (req, h) => {
  const { email, cpf, senha } = req.payload;

  try {
    const user = await UserModel.findOne({
      $or: [{ email: email }, { cpf: cpf }],
    }).select("+senha");

    if (!user)
      return h.response({ error: "Email/CPF ou Senha não conferem" }).code(400);

    const match = await bcrypt.compare(senha, user.senha);

    if (!match)
      return h.response({ error: "Email/CPF ou Senha não conferem" }).code(400);

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: 60 * 60 * 24, //24 hrs
    });
    return h.response(transformer.user(user, token));
  } catch (err) {
    return h.response({ error: "Falha na autenticação" }).code(400);
  }
};

module.exports = {
  authenticate,
};
