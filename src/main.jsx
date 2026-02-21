import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import keycloak from './keycloak';
import { AuthProvider } from './context/AuthContext';
import indexcss from '../index.css'; 

keycloak.init({
  onLoad: 'login-required',
  pkceMethod: 'S256',
  checkLoginIframe: false,
}).then((authenticated) => {
  if (!authenticated) {
    window.location.reload();
  } else {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </React.StrictMode>
    );
  }
});