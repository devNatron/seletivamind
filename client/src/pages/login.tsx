import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { authContext } from '../contexts/AuthContext'
import Styles from '../styles/pages/login.module.css'

type LoginInputProps = {
  login: string,
  senha: string,
}

export function Login(){
  const {handleSignIn, signed, user} = useContext(authContext)
  const [loginInputs, setLoginInputs] = useState<LoginInputProps>({login: '', senha: ''})
  const history = useHistory()

  useEffect(() => {
    history.replace('/')
    if(signed){
      if(user?.acesso === 999)
        history.push('/dashboard/admin')
      else
        history.push('/dashboard/user')
    }
  }, [signed])

  async function handleLoginButton(){
    await handleSignIn(loginInputs)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>){
    const {value, name} = e.target;

    setLoginInputs({...loginInputs, [name]: value});
  }

  return(
      <div className={Styles.pageContainer}>
        <div className={Styles.loginContainer}>
          <input onChange={onInputChange} name="login" type="text" placeholder="Email ou CPF" className={Styles.input}/>
          <input onChange={onInputChange} name="senha" type="password" placeholder="Senha" className={Styles.input}/>
          <button 
            type={'button'} 
            className={Styles.button}
            onClick={handleLoginButton}
          >
            Entrar
          </button>
          <Link to={"/cadastro"}>Não tenho cadastro</Link>
        </div>
      </div>
  )
}