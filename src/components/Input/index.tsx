import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';
// Atribuindo tipagens a uma interface, e colocando campos não obrigatórios nela.
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>;
}
// Recebendo os atributos do Input e passando dentro de props.
const Input: React.FC<InputProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  ...rest
}) => {
  // Dizendo para a referência que ela está armazenando um Input
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  // Callback que é disparado quando o Input não está em foco
  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    // Primeira opção
    // if (inputRef.current?.value) {
    //   setIsFilled(true);
    // } else {
    //   setIsFilled(false);
    // }

    // Segunda opção menos verbosa
    setIsFilled(!!inputRef.current?.value);
  }, []);

  // Callback que será chamado quando o input estiver em foco
  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // Assim que o componente for exibido em tela, chamar a função registerField
  useEffect(
    () => {
      registerField({
        name: fieldName,
        ref: inputRef.current,
        path: 'value',
      });
    }, // useEffect será disparado, toda vez que alguma dessas duas variáveis forem alteradas.
    [fieldName, registerField],
  );

  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isFilled={isFilled}
      isFocused={isFocused}
    >
      {/* Se o Icon existir, então mostre-o */}
      {Icon && <Icon size={20} />}
      <input
        //  {Quando estiver em foco}
        onFocus={handleInputFocus}
        // Quando não estiver em foco
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        // Atribuindo este input a função useRef
        ref={inputRef}
        {...rest}
      />

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Input;
