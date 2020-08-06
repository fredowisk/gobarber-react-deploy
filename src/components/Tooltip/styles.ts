import styled from 'styled-components';

export const Container = styled.div`
  /* O relative, fará que todo absolute seja relativo ao container,
e não ao restante da tela. */
  position: relative;

  span {
    width: 160px;
    background: #ff9000;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.4s;
    /* Escondendo o span da DOM */
    visibility: hidden;

    position: absolute;
    /* Calculo que fará o span aparecer exatamente 12px acima do icone de erro. */
    bottom: calc(100% + 12px);
    /* Este hack faz com que a mensagem de erro fique na metade dos inputs na horizontal */
    left: 50%;
    transform: translateX(-50%);

    color: #312e38;

    /* Hack do CSS que cria um triangulo de ponta cabeça */
    &::before {
      content: '';
      border-style: solid;
      border-color: #ff9000 transparent;
      border-width: 6px 6px 0 6px;
      top: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  &:hover span {
    opacity: 1;
    /* Revelando o span para a DOM */
    visibility: visible;
  }
`;
