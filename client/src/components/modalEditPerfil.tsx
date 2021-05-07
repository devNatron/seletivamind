import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { authContext } from "../contexts/AuthContext";
import Styles from '../styles/components/modalEditPerfil.module.css'

export type editUserSettingsProps = {
  id?: string,
  nome?: string,
  email?: string,
  cpf?: string,
}

export function ModalEditPerfil({id, nome, email, cpf}: editUserSettingsProps){
  const {editUserSettings} = useContext(authContext)
  const [formInputs, setFormInputs] = useState<editUserSettingsProps>({
    id: '',
    nome: '',
    email: '',
    cpf: '',
  })

  const history = useHistory()

  useEffect(() => {
    setFormInputs({
      id: id,
      nome: nome, 
      email: email,
      cpf: cpf
    })
  }, [])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    await editUserSettings(formInputs, id!)
    history.go(0)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>){
    const {value, name} = e.target;

    setFormInputs({...formInputs, [name]: value});
  }

  return(
    <div className={Styles.overlay}>
      <div className={Styles.settingsContainer}>
        <h2>Configure as informações de {nome}</h2>
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
    </div>
  )
}