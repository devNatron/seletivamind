const UserModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const transformer = require("../utils/responseTransformer");
const saltRounds = 10;

const JWT_SECRET = process.env.JWT_SECRET || "teste";

const generateToken = (params) => {
  return jwt.sign(params, JWT_SECRET, {
    expiresIn: 60 * 60 * 24, //24 hrs
  });
};

const reqIncompleta = (items) => {
  items.forEach((item) => {
    if (!item) return true;
  });

  return false;
};

const register = async (req, h) => {
  const { nome, email, cpf, senha } = req.payload;

  if (reqIncompleta([nome, senha, email, cpf]))
    return h.response({ error: "Requisição incompleta" }).code(400);

  const checkUser = await UserModel.findOne({
    $or: [{ email: email }, { cpf: cpf }],
  });

  if (checkUser) return h.response({ error: "Usuário já existente" }).code(409);

  const user = new UserModel({
    nome,
    email,
    cpf,
    acesso: 1,
  });

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(senha, saltRounds, function (err, hash) {
      if (err) h.response(err).code(500);

      resolve(hash);
    });
  });

  user.senha = hashedPassword;

  await user.save();

  const token = generateToken({ id: user.id });

  return h.response(transformer.user(user, user.acesso, token)).code(201);
};

const getOne = async (req, h) => {
  const { id } = req.params;

  const token = generateToken({ id: id });

  const user = await UserModel.findById(id);

  return h.response(transformer.user(user, token)).code(200);
};

const getAll = async (req, h) => {
  const users = await UserModel.find({})
    .select("+acesso")
    .where("acesso")
    .ne(999);

  return h
    .response({
      data: users.map((user) => transformer.user(user, user.acesso)),
    })
    .code(200);
};

const remove = async (req, h) => {
  const { id } = req.params;

  UserModel.deleteOne({ _id: id });

  return h.response().code(204);
};

const update = async (req, h) => {
  const { id, nome, email, cpf } = req.payload;
  if (reqIncompleta([id, nome, email, cpf])) return h.response().code(400);

  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      $set: {
        nome,
        email,
        cpf,
      },
    },
    { new: true }
  ).select("+acesso");
  if (!user) return h.response({ error: "Usuário não encontrado" }).code(400);

  return h.response(transformer.user(user, user.acesso)).code(200);
};

const alterarAcesso = async (req, h) => {
  const { id } = req.payload;

  if (reqIncompleta([id])) return h.response().code(400);

  const user = await UserModel.findById(id).select("+acesso");

  if (!user) return h.response({ error: "Usuário não encontrado" }).code(400);

  const newAcesso = user.acesso == 1 ? 0 : 1;

  await UserModel.findByIdAndUpdate(id, {
    $set: {
      acesso: newAcesso,
    },
  });

  return h.response().code(200);
};

const authenticate = async (req, h) => {
  const { login, senha } = req.payload;
  try {
    const user = await UserModel.findOne({
      $or: [{ email: login }, { cpf: login }],
    }).select("+senha +acesso");

    if (!user) {
      return h.response({ error: "Email/CPF ou Senha não conferem" }).code(400);
    }

    const match = await bcrypt.compare(senha, user.senha);

    if (!match)
      return h.response({ error: "Email/CPF ou Senha não conferem" }).code(400);

    const token = generateToken({ id: user.id });

    return h.response(transformer.user(user, user.acesso, token)).code(200);
  } catch (err) {
    return h.response({ error: "Falha na autenticação" }).code(400);
  }
};

module.exports = {
  register,
  getOne,
  getAll,
  remove,
  authenticate,
  update,
  alterarAcesso,
};
