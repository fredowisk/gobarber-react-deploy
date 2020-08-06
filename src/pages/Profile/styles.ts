import styled from 'styled-components';
// Polished cria animações no CSS
import { shade } from 'polished';

export const Container = styled.div`
  > header {
    height: 144px;
    background: #28262e;

    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        color: #999591;
        width: 30px;
        height: 30px;
      }
    }
  }
`;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: -170px auto 0;

  /* a imagem sempre irá pegar a tela toda, mas nunca irá ultrapassar 700px */
  width: 100%;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
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
`;

// avatar que vai ter um botão de camera por cima da foto
export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;

  /* estilizando a imagem do usuário */
  img {
    width: 186px;
    height: 186px;
    /* deixando arredondado */
    border-radius: 50%;
  }

  /* estilizando o botão que estará por cima da imagem */
  label {
    position: absolute;
    width: 50px;
    height: 50px;
    background: #ff9000;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    border: 0;
    cursor: pointer;
    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    /* Estilo do input dentro da camera */
    input {
      /* display none vai fazer o html sumir da tela */
      display: none;
    }

    /* estilizando a camera por cima do avatar */
    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }

    /* animação de passar o mouse por cima da camera */
    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }
`;
