import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { authContext, userProps } from '../contexts/AuthContext'
import { api } from '../service/api'
import {editUserSettingsProps, ModalEditPerfil} from '../components/modalEditPerfil'
import Styles from '../styles/pages/dashboardAdmin.module.css'

type userFullProps = {
  type: string,
  token: string,
  links: {
    self: string,
  }
  attributes: userProps
}

type modalProps = {
  isOpen: boolean,
  user: editUserSettingsProps
}

export function DashboardAdmin(){
  const {user, signed} = useContext(authContext)
  const [isLoading, setIsLoading] = useState(true)
  const [modalInfo, setModalInfo] = useState<modalProps>({isOpen: false, user: {id: '', nome: '', email:'', cpf:''}})
  const [userList, setUserList] = useState<userProps[]>()
  const history = useHistory()

  useEffect(() => {
    const fethUsers = async () => {
      setIsLoading(true)
      api.get('/api/v1/users')
        .then(({data: res}) => {
          const usersList: userFullProps[] = res.data
          const usersInfo = usersList.map((user) => user.attributes)
          setUserList([...usersInfo])
          setIsLoading(false)
        })
    } 

    fethUsers()
  }, [])

  useEffect(() => {
    if(signed){
      if(user?.acesso != 999)
        history.push('/')
    }
    else
      history.push('/')
  }, [signed])

  function handleEdit(e: React.MouseEvent<HTMLButtonElement>, userId: string){
    const {name} = e.currentTarget
    
    switch (name) {
      case 'editar':
        userList?.forEach((user)=>{
          if(user.id == userId){
            setModalInfo({
              isOpen: true,
              user:{
                id: user.id,
                nome: user.nome,
                email: user.email,
                cpf: user.cpf
              }
            })
          }
        })
        break;
      case 'acesso':
        api.patch('/api/v1/users/alterarAcesso', {
          id: userId,
        }).then(res => {
          const newUserList: userProps[] = userList!;
          newUserList.forEach((user)=>{
            if(user.id == userId){
              user.acesso = user.acesso == 1 ? 0 : 1;
            }
          })
          setUserList([...newUserList])
        })
        break;
      default:
        break;
    }
  }

  return(
    <div>
      {modalInfo.isOpen ? 
      <ModalEditPerfil 
        id={modalInfo.user.id}
        nome={modalInfo.user.nome}
        email={modalInfo.user.email}
        cpf={modalInfo.user.cpf}
      /> :
      <div className={Styles.userListContainer}>
        <h2>Seja bem vindo Administrador {user?.nome}!</h2>
        <h3>Lista de usuários cadastrados:</h3>
          {isLoading ? <h4>Carregando usuários...</h4> : 
            userList?.length != 0 ? (
              <ul className={Styles.userList}>
                <li className={`${Styles.userListItem} ${Styles.userListTitle}`}>
                  <span className={Styles.ItemNome}>Nome</span>
                  <span className={Styles.ItemEmail}>Email</span>
                  <span className={Styles.ItemCpf}>CPF</span>
                </li>
                {userList?.map((user) => {
                  return (
                    <li key={user.id} className={Styles.userListItem}>
                      <span className={Styles.ItemNome}>{user.nome}</span>
                      <span className={Styles.ItemEmail}>{user.email}</span>
                      <span className={Styles.ItemCpf}>{user.cpf}</span>
                      <span className={Styles.ItemOpcoes}>
                        <button name="editar" onClick={(e) => {handleEdit(e, user.id)}}>
                          <img src="/icons/pencil.svg" alt="Editar perfil" title="Editar perfil"/>
                        </button>
                        <button name="acesso" onClick={(e) => {handleEdit(e, user.id)}}>
                          {user.acesso == 1 ? (
                            <img src="/icons/block.svg" alt="Bloquear acesso" title="Bloquear acesso"/>
                            ) : (
                            <img src="/icons/check.svg" alt="Liberar acesso" title="Liberar acesso"/>
                          )}
                        </button>
                      </span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <h4>Nenhum usuário cadastrado.</h4>
            )
          }
      </div>
      }
    </div>
  )
}