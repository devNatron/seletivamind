import React, { useEffect, useState } from 'react'
import { createContext } from "react";
import { useHistory } from 'react-router';
import { SettingsProps } from '../pages/dashboardSettings';
import { api } from '../service/api';
import auth, {SignInProps} from '../service/auth';

type authContextProviderProps = {
  children: React.ReactNode;
}

export type userProps = {
  id: string,
  nome: string,
  email: string,
  cpf: string,
  acesso: number,
}

type authContextProps = {
  signed: boolean;
  user: userProps | undefined;
  handleSignIn: (user: SignInProps) => void;
  handleSignOut: () => void;
  registerSuccess: (user: userProps, token: string) => void;
  setUpdateSettings: (newSettings: SettingsProps) => void;
}

export const authContext = createContext({} as authContextProps)

export default function AuthContextProvider({children}: authContextProviderProps){
  const [user, setUser] = useState<userProps>()

  useEffect(() => {
    const storage_token = localStorage.getItem('token');
    const storage_user = localStorage.getItem('user');

    if(storage_token && storage_user){
      setDefaultHeadersToken(storage_token)
      setUser(JSON.parse(storage_user))
    }
  }, [])
  
  async function handleSignIn(logIn: SignInProps){
    const response = await auth.signIn(logIn)
    
    if(response.error)
      console.log(response.error)

    if(response.data){
      setUser(response.data.attributes)

      setDefaultHeadersToken(response.data.token)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.attributes));
    }
  }

  async function registerSuccess(user: userProps, token:string){
      setUser(user)

      setDefaultHeadersToken(token)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
  }

  async function setUpdateSettings(newSettings: SettingsProps){
    const response = await auth.updateSettings({
      ...newSettings,
      id: user?.id,
    })

    if(response.error){
      console.log(response.error)
    }
    
    if(response.data){
      const newUserInfo = response.data.attributes
      
      setUser(newUserInfo)
      localStorage.setItem('user', JSON.stringify(newUserInfo));
    }
}

  async function handleSignOut(){
    localStorage.clear()
    setUser(undefined)
    setDefaultHeadersToken('')
  }

  function setDefaultHeadersToken(token: string){
    api.defaults.headers['Authorization'] = `Bearer ${token}`
  }

  return(
    <authContext.Provider value={{
      signed: !!user,
      user,
      handleSignIn,
      handleSignOut,
      registerSuccess,
      setUpdateSettings
    }}>
      {children}
    </authContext.Provider>
  )
}
