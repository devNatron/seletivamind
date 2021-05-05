import React from 'react';
import AuthContextProvider from './contexts/AuthContext';

import Routes from './routes'
import './styles/global.css'

export default function App() {
  return (
    <AuthContextProvider>
      <Routes/>
    </AuthContextProvider>
  );
}
