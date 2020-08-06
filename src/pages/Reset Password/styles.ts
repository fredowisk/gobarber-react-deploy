import styled, { keyframes } from 'styled-components';
// Polished cria animações no CSS
import { shade } from 'polished';

import signInBackgroundImg from '../../assets/sign-in-background.png';

export const Container = styled.div`
  /* Forçando o container a estar 100% da view */
  height: 100vh;

  display: flex;
  /* o stretch faz com que os itens dentro do container possuam 100vh */
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* a imagem sempre irá pegar a tela toda, mas nunca irá ultrapassar 700px */
  width: 100%;
  max-width: 700px;
`;

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromLeft} 1s;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }

  /* O sinal > faz com que o CSS pegue apenas os elementos um nivel acima,
  e não um nivel abaixo */

  > a {
    color: #ff9000;
    display: block;
    margin-top: 24px;
    text-decoration: none;

    display: flex;
    align-items: center;

    transition: color 0.2s;

    svg {
      margin-right: 16px;
    }

    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }
  }
`;

export const Background = styled.div`
  /*O flex 1 faz com que ocupe todo o espaço menos os 700px declarado acima. */
  flex: 1;
  background: url(${signInBackgroundImg}) no-repeat center;
  /*Cover garante que a imagems sempre irá cobrir o conteúdo inteiro,
  sem deixar espaços em branco na página. */
  background-size: cover;
`;
