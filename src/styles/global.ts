import { createGlobalStyle } from 'styled-components';

// Criando o estilo global
export default createGlobalStyle`
/* Zerando todos os CSS da aplicação */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: 0;
}
/* Modificando o Body, mudando a cor, e deixando as letras mais bonitas */

body {
  background: #312e38;
  color: #fff;
  -webkit-font-smoothing: antialiased;
}

/*Alterando o estilo das fontes */
body, input, button {
  font-family: 'Roboto slab', serif;
  font-size: 16px;
}

/*Definindo os headers com negrito */
h1, h2, h3, h4, h5, h6, strong {
  font-weight: 500;
}

/*Definindo o estilo do cursor quando passar por cima do botão */
button {
  cursor: pointer;
}
`;
