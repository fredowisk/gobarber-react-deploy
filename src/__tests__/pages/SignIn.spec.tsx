import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

// criando a variavel fora do test, para ela poder ser pega lá em baixo
const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

// criando o mock fora dos testes, para poder ser usado em todos os testes.
jest.mock('react-router-dom', () => {
  return {
    // quando o useHistory for chamado, agora ele terá uma função push, que será vazia
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    // As propriedades vão ter apenas uma propriedade chamada children
    // que são do tipo ReactNode que é uma tipagem que é qualquer conteudo que um componente
    // react poderia receber
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

// criando um mock de sign in, com uma função que poderá ser trocada por um erro
jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

// criando um mock para o toast ser chamado
jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

// criando um teste para a pagina de signIn
describe('SignIn Page', () => {
  beforeEach(() => {
    // limpando o valor do history antes de cada teste
    mockedHistoryPush.mockClear();
  });
  // deverá ser possivel fazer o sign in
  it('should be able to sign in', async () => {
    // renderizando a pagina signIn para começar os testes
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    // pegando o campo de email e o de senha
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    // alterando o conteudo, passando um objeto que ira agir igual ao evento do frontend
    fireEvent.change(emailField, { target: { value: 'jhondoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      // eu espero que a função tenha sido chamada com o parâmetro /dashboard
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });
  it('should not be able to sign in with invalid credentials', async () => {
    // renderizando a pagina signIn para começar os testes
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    // pegando o campo de email e o de senha
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    // alterando o conteudo, passando um objeto que ira agir igual ao evento do frontend
    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      // eu espero que a função NÃO tenha sido chamada
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });
  it('should display an error if login fails', async () => {
    // reescrevendo o valor da função, para ela gerar um erro no signIn
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    // renderizando a pagina signIn para começar os testes
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    // pegando o campo de email e o de senha
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    // alterando o conteudo, passando um objeto que ira agir igual ao evento do frontend
    fireEvent.change(emailField, { target: { value: 'jhondoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      // eu espero que a função tenha sido chamada com um parâmetro
      // que seja um objeto contendo type com o valor 'error'
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
