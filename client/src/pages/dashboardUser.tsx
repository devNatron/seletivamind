import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router'
import { authContext } from '../contexts/AuthContext'

import Styles from '../styles/pages/dashboardUser.module.css'

export function DashboardUser(){
  const {user, signed} = useContext(authContext)
  const history = useHistory()

  useEffect(() => {
    if(signed){
      if(user?.acesso === 999){
        history.push('/dashboard/admin')
      }
    }
    else
      history.push('/')
  }, [signed])

  return(
    <div>
      <div className={Styles.userInfoContainer}>
        <h2>Seja bem vindo {user?.nome}!</h2>
        <h3>Suas informações cadastradas:</h3>
        <div className={Styles.userInfo}>
          <p>Nome: {user?.nome}</p>
          <p>Email: {user?.email}</p>
          <p>CPF: {user?.cpf}</p>
        </div>
      </div>
    </div>
  )
}