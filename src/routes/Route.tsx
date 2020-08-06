import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

// Ao extender a interface com base na importação RouteProps, ela herda
// todas as caracteristicas.
interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  // Criando uma propriedade para receber um componente apenas pelo seu nome
  // como parâmetro, sem as '<>'
  component: React.ComponentType;
}

// true/true = ok
// true/false = Redirecionar ele pro login
// false/true = Redirecionar para o Dashboard
// false/false = = ok

// Definindo o valor inicinal como false, caso ela venha vazia.
const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  // se dentro da variavel user tiver algo, isso significa que o usuário está autenticado.
  const { user } = useAuth();

  return (
    // O route tem uma propriedade adicional que se chama 'render'
    // Que modifica a logistica que ele faz para mostrar alguma rota em tela (componente da página)
    <ReactDOMRoute
      {...rest}
      // Location é como se fosse um histórico.
      render={({ location }) => {
        // Se a rota ser privada é igual ao usuário ser autenticado
        return isPrivate === !!user ? (
          <Component />
        ) : (
          // Se for uma rota autenticada enviar ele para o login,
          // senão dashboard.
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              // passando um state com o location, para ele conseguir recuperar informações.
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
