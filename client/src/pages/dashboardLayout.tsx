import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { authContext } from '../contexts/AuthContext'

import Styles from '../styles/pages/dashboardLayout.module.css'

type DashboardProps = {
  children: React.ReactNode
}
export function DashboardLayout({children}: DashboardProps){
  const {handleSignOut} = useContext(authContext)
  const history = useHistory() 

  function signOut(){
    handleSignOut()
  }

  return(
    <div className={Styles.dashboardContainer}>
        <header className={Styles.headerContainer}>
          <h1>Dashboard</h1>
          <div className={Styles.perfil}>
          <Link to={"/dashboard/settings"}>
            <button className={Styles.perfilButton}>
              <img src="/icons/perfil.svg" alt="Perfil"/>
            </button>
          </Link>
            <button type={'button'} onClick={signOut}>
              Sair
            </button>
          </div>
        </header>
        {children}
    </div>
  )
}