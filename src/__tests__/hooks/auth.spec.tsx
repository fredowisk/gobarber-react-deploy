import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { useAuth, AuthProvider } from '../../hooks/auth';
import api from '../../services/api';

// criando uma api mock
const apiMock = new MockAdapter(api);

// Testes para o hook de autorização
describe('Auth hook', () => {
  // deve ser possivel fazer sign in
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'Jhon Doe',
        email: 'jhondoe@example.com.br',
      },
      token: 'token-123',
    };
    // toda vez que eu tiver uma requisição do tipo post na rota sessions
    // eu irei escolher o retorno que eu quero para esta requisição
    apiMock.onPost('sessions').reply(200, apiResponse);

    // espionando se a função setItem do localStorage foi disparada ou não
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    // utilizando o render hook para o nosso arquivo de autorização
    const { result, waitForNextUpdate } = renderHook(
      () => useAuth(),
      // o wrapper é o componente que queremos colocar por volta do useAuth
      { wrapper: AuthProvider },
    );

    // executando a função signIn
    result.current.signIn({
      email: 'jhondoe@example.com.br',
      password: '123456',
    });

    // Ele irá esperar até que alguma modificação seja feita dentro do Hook
    await waitForNextUpdate();

    // Eu espero que a função setItem tenha sido chamada com o token que informamos
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    );
    // Eu espero que a função setItem tenha sido chamada com o user que informamos
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );
    // eu espero que o email seja igual ao @
    expect(result.current.user.email).toEqual('jhondoe@example.com.br');
  });

  // deve pegar informações que já estiverem salvas no local storage
  it('should restore saved data from storage when auth inits', () => {
    // pegando a função getItem do local storage e recriando ela
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'Jhon Doe',
            email: 'jhondoe@example.com.br',
          });
        default:
          return null;
      }
    });

    // utilizando o render hook para o nosso arquivo de autorização
    const { result } = renderHook(
      () => useAuth(),
      // o wrapper é o componente que queremos colocar por volta do useAuth
      { wrapper: AuthProvider },
    );

    // eu espero que o email pego no local storage seja igual ao @
    expect(result.current.user.email).toEqual('jhondoe@example.com.br');
  });

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'Jhon Doe',
            email: 'jhondoe@example.com.br',
          });
        default:
          return null;
      }
    });
    // pegando a função remove item do local storage e recriando ela
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    // utilizando o render hook para o nosso arquivo de autorização
    const { result } = renderHook(
      () => useAuth(),
      // o wrapper é o componente que queremos colocar por volta do useAuth
      { wrapper: AuthProvider },
    );

    // o act vai fazer o código esperar o resultado desta função
    // pois a função signOut não é assincrona e ela faz uma alteração no estado que leva um tempo
    act(() => {
      // chamando a função de signOut para apagar o local storage
      result.current.signOut();
    });

    // espero que a função de remover do local storage tenha sido chamada 2 vezes
    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    // eu espero que o usuário pego no local storage seja undefined pois o e-mail não existe mais
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', async () => {
    // espiando a função setItem do local storage
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    // renderizando do hook useAuth
    const { result } = renderHook(() => useAuth(), {
      // wrapper vai ficar por volta do useAuth
      wrapper: AuthProvider,
    });

    // criando o usuário
    const user = {
      id: 'user123',
      name: 'Jhon Doe',
      email: 'jhondoe@example.com.br',
      avatar_url: 'avatar_url',
    };

    // utilizando o act pois o updateUser não é assincrono, mas leva um tempo para pegar seu resultado
    act(() => {
      result.current.updateUser(user);
    });
    // eu espero que o setItem tenha sido chamado com o local storage e tenha recebido o usuário.
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );
    // eu espero que o usuário do local storage seja igual ao usuário que foi enviado
    expect(result.current.user).toEqual(user);
  });
});
