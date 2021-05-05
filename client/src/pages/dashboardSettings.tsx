import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { authContext } from '../contexts/AuthContext'
import Styles from '../styles/pages/dashboardSettings.module.css'

export type SettingsProps = {
  nome?: string,
  email?: string,
  cpf?: string,
}

export function DashboardSettings(){
  const {user, signed, setUpdateSettings} = useContext(authContext)
  const [formInputs, setFormInputs] = useState<SettingsProps>({
    nome: '',
    email: '',
    cpf: '',
  })
  const history = useHistory()

  useEffect(() => {
    if(!signed)
      history.push('/')

    setFormInputs({
      nome: user?.nome, 
      email: user?.email,
      cpf: user?.cpf
    })
  }, [signed])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    setUpdateSettings(formInputs)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>){
    const {value, name} = e.target;

    setFormInputs({...formInputs, [name]: value});
  }

  return(
    <div className={Styles.settingsContainer}>
      <h2>Configure suas informações</h2>
      <form onSubmit={handleSubmit} className={Styles.formSettings}>
        <label htmlFor="nome">Insira seu nome:</label>
        <input value={formInputs.nome} onChange={onInputChange} name="nome" type="text" className={Styles.input}/>
        <label htmlFor="email">Insira seu email:</label>
        <input value={formInputs.email} onChange={onInputChange} name="email" type="text" className={Styles.input}/>
        <label htmlFor="cpf">Insira seu CPF (000.000.000-00):</label>
        <input value={formInputs.cpf} onChange={onInputChange} name="cpf" type="text" className={Styles.input}/>
        <button type='submit' className={Styles.button}>
          Atualizar dados
        </button>
      </form>
    </div>
  )
}