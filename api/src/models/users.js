const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nome: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
    lowercase: true,
  },
  cpf: {
    type: String,
    unique: true,
    require: true,
  },
  senha: {
    type: String,
    require: true,
    select: false,
  },
  acesso: {
    type: Number,
    require: true,
    select: false,
  },
});

module.exports = mongoose.model("User", UserSchema);
