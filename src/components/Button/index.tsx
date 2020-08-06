import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

// Quando a interface for vazia, se utiliza o type e recebe a tipagem dentro da interface.
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  // colocando mais uma propriedade no botão, no caso a loading
  loading?: boolean;
};

// Recebendo os atributos do Button e passando dentro de props.
const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {/* Conteúdo do botão */}
    {/* se o loading estiver true mostre carregando, e se for false
    mostre o texto original do botão */}
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
