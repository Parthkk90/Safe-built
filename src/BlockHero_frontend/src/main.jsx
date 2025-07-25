// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { IdentityProvider } from './IdentityContext';
import { UserProvider } from './UserContext';

ReactDOM.render(
    <HashRouter>
      <IdentityProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </IdentityProvider>
    </HashRouter>,
    document.getElementById('root')
);
