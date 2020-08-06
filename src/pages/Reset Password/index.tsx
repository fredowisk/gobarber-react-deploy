import React, { useRef, useCallback } from 'react';

import { FiLock } from 'react-icons/fi';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  // toast são mensagens TOAST
  const { addToast } = useToast();
  // utilizamos o history para navegar pelas abas em que o usuário já esteve
  const history = useHistory();
  // o location vai pegar o token que está na URL
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        // Fazendo os erros começarem vazios.
        formRef.current?.setErrors({});

        // schema é utilizado quando se quer validar um objeto inteiro, no caso o 'data'.
        // o Yup receberá um objecto e será desta forma 'shape'
        const schema = Yup.object().shape({
          password: Yup.string()
            .required('Senha obrigatória')
            .min(6, 'No mínimo 6 dígitos'),
          // verificando se o campo é uma string e se possui o mesmo valor do campo password
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'As senhas precisam ser iguais',
          ),
        });

        // passando a variável data para ser validada pelo schema.
        await schema.validate(data, {
          // o abortEarly faz com que o Yup não pare no primeiro erro,
          // e mostre todos de uma vez só.
          abortEarly: false,
        });
        // desestruturando
        const { password, password_confirmation } = data;
        // o location irá procurar e apagar o ?token= da rota, assim sobrando apenas o token
        const token = location.search.replace('?token=', '');

        // se o token não existe
        if (!token) {
          // estamos verificando o token aqui, para que não seja necessário chegar a utilizar
          // nosso backend para gerar um erro, já que o token não existe, podemos resolver aqui o mais rápido possivel
          throw new Error();
        }

        // mandando as senhas para o backend trata-las
        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/');
      } catch (err) {
        // verificando se o erro é uma instancia do Yup
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          // O ponto de interrogação verifica se a variável existe, para depois chamar a função
          // setErrors
          formRef.current?.setErrors(errors);

          return;
        }
        // disparar um toast
        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
        });
      }
    },
    // Variaveis que o callback depende.
    [location, addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da senha"
            />
            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};
export default ResetPassword;
