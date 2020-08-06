import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #232129;
  border-radius: 10px;
  padding: 16px;
  width: 100%;

  border: 2px solid #232129;
  color: #666360;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

/* Definindo apenas a cor do prop input como vermelha */
  ${props =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

/* Definindo a cor e a borda do prop input como laranja */
  ${props =>
    props.isFocused &&
    css`
      color: #ff9000;
      border-color: #ff9000;
    `}
/* Definindo apenas a cor do prop input como laranja */
  ${props =>
    props.isFilled &&
    css`
      color: #ff9000;
    `}



  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #f4ede8;

    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 16px;
  }
`;

// As regras aplicadas no Error será aplicada no 'Container' do Tooltip
export const Error = styled(Tooltip)`
  /* Definindo o height para que ele fique do tamanho do input
assim quando um erro acontecer, ele ainda continuará do mesmo tamanho.
E definindo um margin-left para que o texto digitado não encoste no icone de erro. */
  height: 20px;
  margin-left: 16px;
  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;
    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
