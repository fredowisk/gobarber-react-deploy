import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import GlobalStyle from './styles/global';

import AppProvider from './hooks';

import Routes from './routes';

// Deixando o código menos verboso
const App: React.FC = () => (
  <Router>
    <AppProvider>
      {/* Para criarmos as rotas precisamos do BrowserRouter */}
      <Routes />
    </AppProvider>

    <GlobalStyle />
  </Router>
);
export default App;
