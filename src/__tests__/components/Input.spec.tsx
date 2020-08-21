import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Input from '../../components/Input';

// criando um mock para o input, pois no seu arquivo ele utiliza a biblioteca @unform/core
jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

// testes para o componente de input
describe('Input component', () => {
  // deve ser possivel renderizar um input
  it('should be able to render an input', () => {
    // pegando o input desejado
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    // eu espero que o placeholder com o texto e-mail exista
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  // deve ativar um efeito quando o usuário clicar em um input
  it('should render highlight on input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );
    // pegando o input com email
    const inputElement = getByPlaceholderText('E-mail');
    // pegando o container pelo id de teste colocado lá no index.tsx
    const containerElement = getByTestId('input-container');
    // evendo que vai dar foco/clicar no input
    fireEvent.focus(inputElement);

    await waitFor(() => {
      // eu espero que o meu container tenha o estilo de borda, e a cor da fonte laranja
      expect(containerElement).toHaveStyle('border-color: #ff9000;');
      expect(containerElement).toHaveStyle('color: #ff9000;');
    });
    // evento que vai desfocar do input
    fireEvent.blur(inputElement);

    await waitFor(() => {
      // eu espero que o meu container PERCA o estilo de borda, e a cor da fonte laranja
      expect(containerElement).not.toHaveStyle('border-color: #ff9000;');
      expect(containerElement).not.toHaveStyle('color: #ff9000;');
    });
  });
  it('should keep input border highlight when input filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );
    // pegando o input com email
    const inputElement = getByPlaceholderText('E-mail');

    // pegando o container pelo id de teste colocado lá no index.tsx
    const containerElement = getByTestId('input-container');

    // preenchendo o input com um e-mail
    fireEvent.change(inputElement, {
      target: { value: 'jhondoe@example.com.br' },
    });

    // evento que vai desfocar do input
    fireEvent.blur(inputElement);

    await waitFor(() => {
      // eu espero que o meu container continue com o estilo de cor da fonte laranja
      // pois ele está desfocado, porém preenchido
      expect(containerElement).toHaveStyle('color: #ff9000;');
    });
  });
});
