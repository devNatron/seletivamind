import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router';
import { authContext } from '../contexts/AuthContext';
import auth from '../service/auth';
import Styles from '../styles/pages/cadastro.module.css'

type CadastroProps = {
  nome: string,
  email: string,
  cpf: string,
  senha: string,
  senhaCheck: string,
}

export function Cadastro(){
  const {registerSuccess} = useContext(authContext)
  const [formInputs, setFormInputs] = useState<CadastroProps>({
    nome: '',
    email: '',
    cpf: '',
    senha: '',
    senhaCheck: '',
  })

  const history = useHistory()

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>){
    const {value, name} = e.target;

    setFormInputs({...formInputs, [name]: value});
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    const response = await auth.register(formInputs)

    if(response.error)
      console.log(response.error)
    
    if(response.data)
      registerSuccess(response.data.attributes, response.data.token)
      history.push('/dashboard/user')
  }

  return(
    <div className={Styles.pageContainer}>
      <div className={Styles.cadastroContainer}>
        <form onSubmit={handleSubmit} className={Styles.formContainer}>
          <label htmlFor="nome">Insira seu nome:</label>
          <input required value={formInputs.nome} onChange={onInputChange} name="nome" type="text" className={Styles.input}/>
          <label htmlFor="email">Insira seu email:</label>
          <input required value={formInputs.email} onChange={onInputChange} name="email" type="text" className={Styles.input}/>
          <label htmlFor="cpf">Insira seu CPF (000.000.000-00):</label>
          <input required value={formInputs.cpf} onChange={onInputChange} name="cpf" type="text" className={Styles.input}/>
          <label htmlFor="senha">Insira uma senha:</label>
          <input required value={formInputs.senha} onChange={onInputChange} name="senha" type="password" className={Styles.input}/>
          <label htmlFor="senhaCheck">repita a senha:</label>
          <input required value={formInputs.senhaCheck} onChange={onInputChange} name="senhaCheck" type="password" className={Styles.input}/>
          <button type='submit' className={Styles.button}>
            Criar conta
          </button>
        </form>
      </div>
    </div>
  )
}