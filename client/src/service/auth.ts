import {api} from './api'
import {userProps} from '../contexts/AuthContext'

export type SignInProps = {
  login: string,
  senha: string
}

type RegisterProps = {
  nome: string,
  email: string,
  cpf: string,
  senha: string,
}

type NewSettingsProps = {
  id?: string,
  nome?: string,
  email?: string,
  cpf?: string,
}

type responseProps = {
  data?: {
    type: string,
    token: string,
    links: {
      self: string,
    }
    attributes: userProps
  },
  error?: string,
}

async function signIn(signInfo: SignInProps){
  const response: responseProps = await new Promise((resolve, reject) => {
    api.post('/api/v1/users/auth', signInfo)
      .then(res => resolve({data: res.data} as responseProps))
      .catch(err => reject({error: err.response.data.error}))
  });

  return response;
}

async function register(formInputs: RegisterProps){
  const response: responseProps = await new Promise((resolve, reject) => {
    api.post('/api/v1/users/register', formInputs)
      .then(res => resolve({data: res.data} as responseProps))
      .catch(err => reject({error: err.response.data.error}))
  });

  return response;
}

async function updateSettings(newSettings: NewSettingsProps){
  const response: responseProps = await new Promise((resolve, reject) => {
    api.patch('/api/v1/users', newSettings)
      .then(res => resolve({data: res.data} as responseProps))
      .catch(err => reject({error: err.response.data.error}))
  });

  return response;
}



export default {
  signIn,
  register,
  updateSettings
}