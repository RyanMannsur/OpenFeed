# OpenFeed
Plataforma de artigos de opinião onde usuários podem criar contas, personalizar seus perfis e publicar textos sobre Futebol, Esportes, Entretenimento, Filmes e Séries. Além de escrever, cada usuário pode avaliar artigos de outras pessoas, criando uma comunidade dinâmica e colaborativa.

Site publicado: https://openfeed-vg1b.onrender.com/user/1

## Sumário

- [Frontend](#frontend)
- [Publicação (Render)](#publicação-render)
- [Trello](#trello)

## Frontend

O frontend do projeto foi desenvolvido com Angular e utiliza as bibliotecas Material Icons e Bootstrap para apoio na interface e nos componentes visuais.

O sistema é responsivo para PC e celular.

Atualmente o sistema ainda funciona com dados mockados no frontend e não possui backend/API conectada.

Conta mock alternativa para entrar:

- E-mail: adm@gmail.com
- Senha: 1234

## Publicação (Render)

Foi adicionada a estrutura de deploy com Docker para publicar no Render:

> Status atual: publicação somente do frontend Angular (SSR). O sistema usa mock local e ainda não tem backend/API.

- `Dockerfile` na raiz do repositório
- `.dockerignore` para reduzir contexto de build
- `render.yaml` com configuração base do serviço web

## Trello

- https://trello.com/invite/b/69e3e77877caa28d885c08fa/ATTIe145310dfcdb88435c999ce9e2372059CB377B9C/openfeed
