import React, { useCallback, useRef, ChangeEvent } from 'react';

import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';

import { FormHandles } from '@unform/core';

import { Form } from '@unform/web';

import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        // Fazendo os erros começarem vazios.
        formRef.current?.setErrors({});

        // schema é utilizado quando se quer validar um objeto inteiro, no caso o 'data'.
        // o Yup receberá um objecto e será desta forma 'shape'
        const schema = Yup.object().shape({
          // o nome deve ser uma string obrigatória
          name: Yup.string().required('Nome obrigatório'),
          // o email deve ser uma string obrigatória do tipo e-mail
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          // a senha antiga deve ser do tipo string
          old_password: Yup.string(),
          // a nova senha deve ser do tipo string e só deverá ser preenchida
          // se o calo old_password estiver preenchido
          password: Yup.string().when('old_password', {
            // verificando se o campo não está vazio
            is: val => !!val.length,
            // se estiver ele deve ter no minimo 6 digitos e ser required
            then: Yup.string().required().min(6, 'No mínimo 6 dígitos'),
            // se não apenas deixe-o vazio
            otherwhise: Yup.string(),
          }),
          // a confirmação de senha deve ser uma string, e o seu valor deve
          // ser identico ao do campo password
          password_confirmation: Yup.string()
            .when('old_password', {
              // verificando se o campo não está vazio
              is: val => !!val.length,
              // se estiver ele deve ter no minimo 6 digitos e ser required
              then: Yup.string(),
              // se não apenas deixe-o vazio
              otherwhise: Yup.string(),
            })
            .oneOf(
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
        // desestruturando o data
        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;
        // formatando o que será enviado para a API
        const formData = {
          // recebendo nome e email
          name,
          email,
          // se o old password estiver preenchido
          ...(data.old_password
            ? {
                // receba todos esses valores
                old_password,
                password,
                password_confirmation,
              }
            : // senão não receba nada
              {}),
        };

        const response = await api.put('/profile', formData);
        // enviando o dados retornados
        updateUser(response.data);
        // enviando o usuário para o dashboard
        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Perfil atualizado!',
          description: 'Suas informações foram alteradas!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          // O ponto de interrogação verifica se a variável existe, para depois chamar a função
          // setErrors
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao atualizar perfil',
          description:
            'Ocorreu um erro ao atualizar o perfil, tente novamente.',
        });
      }
    },
    [addToast, history, updateUser],
  );

  // passando um evento como parâmetro na função que atualiza o avatar
  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // se o evento receber um arquivo
      if (e.target.files) {
        // criando o formData pois no backend estamos utilizando multipart
        const data = new FormData();
        // atribuindo o arquivo ao campo avatar
        data.append('avatar', e.target.files[0]);
        // utilizando a rota da api para enviar o arquivo
        api.patch('/users/avatar', data).then(response => {
          // atualizando os dados
          updateUser(response.data);
          // mandando uma mensagem toast de sucesso
          addToast({
            type: 'success',
            title: 'Avatar atualizado!',
          });
        });
      }
    }, // dependência
    [addToast, updateUser],
  );
  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          // dando um valor inicial, para já estar no input
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            {/* hackzinho para não utilizarmos o input tradicional */}
            <label htmlFor="avatar">
              <FiCamera />
              {/* input dentro da camera para trocar o avatar */}
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            // utilizando o cainterStyle para passar como parâmetro e dar o espaçamento
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />
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
            placeholder="Confirme a nova senha"
          />
          <Button type="submit">Atualizar</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
