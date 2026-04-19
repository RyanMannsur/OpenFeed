# OpenFeed
Plataforma de artigos de opinião onde usuários podem criar contas, personalizar seus perfis e publicar textos sobre Futebol, Esportes, Entretenimento, Filmes e Séries. Além de escrever, cada usuário pode avaliar artigos de outras pessoas, criando uma comunidade dinâmica e colaborativa.

## Sumário

- [Frontend](#frontend)
- [Publicação (Render)](#publicação-render)
- [Trello](#trello)

## Frontend

O frontend do projeto foi desenvolvido com Angular e utiliza as bibliotecas Material Icons e Bootstrap para apoio na interface e nos componentes visuais.

Essa base foi escolhida para facilitar a criação de uma interface organizada, responsiva e pronta para evoluir conforme o projeto crescer.

## Publicação (Render)

Foi adicionada a estrutura de deploy com Docker para publicar no Render:

> Status atual: publicação somente do frontend Angular (SSR). Backend/API ficará para uma próxima etapa.

- `Dockerfile` na raiz do repositório
- `.dockerignore` para reduzir contexto de build
- `render.yaml` com configuração base do serviço web

### Como configurar no Render (Web Service)

- Runtime/Linguagem: `Docker`
- Branch: `main`
- Região: `Oregon (US West)`
- Root Directory: deixar vazio
- Dockerfile Path: `./Dockerfile`
- Plano: `Free` (ou outro)

### Variáveis de ambiente

- `NODE_ENV=production`
- `PORT` é definido automaticamente pelo Render

### O que o Docker faz

1. Instala dependências do frontend Angular SSR
2. Gera build de produção (`ng build`)
3. Inicia o servidor Node SSR em `dist/frontend/server/server.mjs`

## Trello

- https://trello.com/invite/b/69e3e77877caa28d885c08fa/ATTIe145310dfcdb88435c999ce9e2372059CB377B9C/openfeed
