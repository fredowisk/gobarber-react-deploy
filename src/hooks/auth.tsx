import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

// Criando um contexto vazio e forçando sua tipagem a ser do tipo AuthContextData
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Criando um componente
export const AuthProvider: React.FC = ({ children }) => {
  // o estado é o melhor lugar para armazenar informações.
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    // se o token e o user estiverem preenchidos...
    if (token && user) {
      // definindo como padrão um cabeçalho(header) com nome authorization
      // com o valor do token e ele será aplicado para todas requisições de agora em diante
      api.defaults.headers.authorization = `Bearer ${token}`;
      // transformando a string user em um objeto
      return { token, user: JSON.parse(user) };
    }

    // Se não existir nem o token ou o user a função retorna vazia
    // forçando o typescript a entender que ela é do tipo AuthState
    return {} as AuthState;
  });

  // Utilizando o Callback para criar uma função assincrona que recebe como parâmetro,
  // o email e a senha.
  const signIn = useCallback(async ({ email, password }) => {
    // utilizando post na rota sessions, passando pra ela o email e a senha.
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    // Utilizando o local storage para salvar o token e o user.
    // o '@GoBarber' é um prefixo.
    localStorage.setItem('@GoBarber:token', token);
    // transformando o objeto user em uma string.
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    // definindo como padrão um cabeçalho(header) com nome authorization
    // com o valor do token e ele será aplicado para todas requisições de agora em diante
    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  // Metodo que para deslogar
  const signOut = useCallback(() => {
    // limpando o localStorage
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    // Deixando o data vazio
    setData({} as AuthState);
  }, []);

  // metodo que irá atualizar as informações do usuário
  const updateUser = useCallback(
    (user: User) => {
      // atualizando o localStorage do navegador
      localStorage.setItem('@GoBarber:user', JSON.stringify(user));
      setData({
        // pegando o token lá de cima, da autenticação
        token: data.token,
        user,
      });
    }, // dependências
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {/* Repassando tudo o que foi recebido como parâmetro */}
      {children}
    </AuthContext.Provider>
  );
};

// Função que verifica se o contexto ainda não foi criado, e o retorna.
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
