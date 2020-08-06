import React, { createContext, useContext, useCallback, useState } from 'react';
import { uuid } from 'uuidv4';

import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  // Criando um id para não ocorrer erro, quando várias mensagens iguais aparecerem.
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

// Inicializando o objeto ToastContext sempre vazio.
const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC = ({ children }) => {
  // O melhor lugar para se guardar uma informação é no estado da nossa aplicação.
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  // Eu quero todas as propriedades do ToastMessage, menos o 'id'
  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      // criando um id unico.
      const id = uuid();

      const toast = {
        id,
        type,
        title,
        description,
      };
      // Quando eu vou adicionar um novo toast eu não quero perder os que já estão em tela,
      // Portando eu copio todos e adiciono o novo toast no final.
      setMessages(state => [...state, toast]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    // Pega todas as mensagens e retorna apenas aquela que for diferente do id
    // recebido como parâmetro.
    setMessages(state => state.filter(message => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  //   Se o context não existir, isso significa que utilizamos o useToast fora de um
  // component com o toastProvider...
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  // se tudo der certo retornamos o contexto.
  return context;
}
