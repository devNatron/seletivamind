import React from 'react'

import { BrowserRouter, Route, Switch, Redirect, RouteProps } from 'react-router-dom'
import { Cadastro } from './pages/cadastro';
import { DashboardAdmin } from './pages/dashboardAdmin';
import { DashboardLayout } from './pages/dashboardLayout';
import { DashboardUser } from './pages/dashboardUser';
import { DashboardSettings } from './pages/dashboardSettings';
import { Login } from './pages/login';

const PrivateRoute = ({component: Component, ...rest}: RouteProps) => {
  const signed = !!localStorage.getItem('user')
  if (!Component) return <Redirect to={{pathname:"/"}}/>
  return (
    <Route
      {...rest}
      render={props => 
        signed ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{pathname:"/"}}/>
        )
      }
    />
  )
};

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={() => <Login/>}/>
      <Route path="/cadastro" component={() => <Cadastro/>}/>

      <Route path="/dashboard/:path?" exact>
        <DashboardLayout>
          <Switch>
            <PrivateRoute path="/dashboard/user" exact component={() => <DashboardUser/>}/>
            <PrivateRoute path="/dashboard/admin" exact component={() => <DashboardAdmin/>}/>
            <PrivateRoute path="/dashboard/settings" exact component={() => <DashboardSettings/>}/>
          </Switch>
        </DashboardLayout>
      </Route>

      <Route path="*" component={() => <Login/>}/>
    </Switch>
  </BrowserRouter>
);

export default Routes;