import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

// Rotas publicas
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/Forgot Password';
import ResetPassword from '../pages/Reset Password';

// Rotas privadas
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

const Routes: React.FC = () => (
  <Switch>
    {/* Rotas publicas
    O exact faz a rota não confundir o '/'
     Login */}
    <Route path="/" exact component={SignIn} />
    {/* Criação de conta */}
    <Route path="/signup" component={SignUp} />
    {/* Esqueci minha senha */}
    <Route path="/forgot-password" component={ForgotPassword} />
    {/* Resetando a senha */}
    <Route path="/reset-password" component={ResetPassword} />

    {/* Rotas privadas

    Listagem de agendamentos */}
    <Route path="/dashboard" component={Dashboard} isPrivate />
    {/* Perfil do usuário */}
    <Route path="/profile" component={Profile} isPrivate />
  </Switch>
);

export default Routes;
