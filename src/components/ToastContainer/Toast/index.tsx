import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from 'react-icons/fi';

import { ToastMessage, useToast } from '../../../hooks/toast';
import { Container } from './styles';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  // Disparar uma ação assim que um Toast surgir na tela.
  useEffect(() => {
    // Eu quero que a função remove toast seja executada após 3 segundos.
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    // se eu retornar uma função dentro de um useEffect ela é automaticamente
    // executada se este componente morrer.
    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, message.id]);

  return (
    <Container
      type={message.type}
      // Verificando se a mensagem tem descrição, transformando ela em um boolean usando o number.
      hasDescription={Number(!!message.description)}
      style={style}
    >
      {/* Criando um if para retornar o icone com base no type,
      ou retornar o icone padrão que é o 'info' */}
      {icons[message.type || 'info']}

      <div>
        <strong>{message.title}</strong>
        {/* Se a mensagem tiver descrição, então escreva. */}
        {message.description && <p>{message.description}</p>}
      </div>
      {/* Criando arrow function, para que a função não seja executada instantaneamente */}
      <button onClick={() => removeToast(message.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
