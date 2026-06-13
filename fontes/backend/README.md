# 🚀 OpenFeed Backend API

Este é o backend da plataforma **OpenFeed**, desenvolvido com **Node.js**, **Express** e **MySQL**, estruturado sob a arquitetura de software **MVC (Model-View-Controller)**.

A API foi projetada para ser rápida, segura, totalmente assíncrona (`async/await`) e modular, pronta para alimentar o frontend desenvolvido em Angular.

---

## 📐 Arquitetura do Projeto (MVC)

A arquitetura segue o modelo **MVC** adaptado para uma **API RESTful**. Onde:
- **Model**: Responsável pelo acesso direto ao banco de dados (MySQL) usando pools de conexão resilientes e consultas SQL parametrizadas para proteção contra SQL Injection.
- **View**: Como é uma API REST, o papel da "View" é desempenhado pelas **respostas JSON** estruturadas retornadas ao cliente/frontend.
- **Controller**: Gerencia as requisições HTTP, valida os parâmetros de entrada, chama as regras de negócio nos Models e decide qual resposta e código HTTP retornar.

### Estrutura de Pastas Criada

```text
fontes/backend/
├── src/
│   ├── config/
│   │   └── database.js      # Pool de conexão MySQL e teste de conectividade
│   ├── controllers/
│   │   ├── articleController.js # Lógicas CRUD de artigos com validação de autoria
│   │   ├── authController.js    # Lógica de registro e login (bcrypt + JWT)
│   │   └── userController.js    # Perfil do usuário e artigos autorais
│   ├── middlewares/
│   │   ├── authMiddleware.js    # Validador de token JWT de segurança
│   │   └── errorMiddleware.js   # Capturador de rotas 404 e erros globais (500)
│   ├── models/
│   │   ├── articleModel.js      # Operações e filtros avançados na tabela `articles`
│   │   └── userModel.js         # Operações de CRUD na tabela `users`
│   ├── routes/
│   │   ├── articleRoutes.js     # Rotas de artigos (públicas e autenticadas)
│   │   ├── authRoutes.js        # Rotas de registro e login
│   │   ├── userRoutes.js        # Rotas de gerenciamento de perfis
│   │   └── index.js             # Centralizador de rotas da API (/api)
│   └── app.js               # Instância e configuração principal do Express
├── .env                     # Variáveis de ambiente locais (porta, DB, segredos)
├── .env.example             # Modelo das variáveis de ambiente do projeto
├── .gitignore               # Arquivos a ignorar no git (node_modules, .env)
├── package.json             # Definição das dependências e scripts do Node.js
├── schema.sql               # Script DDL completo do banco MySQL e dados de mock
└── server.js                # Arquivo de entrada do servidor
```

---

## 🛠️ Tecnologias Utilizadas

- **Express**: Framework web minimalista e extremamente performático.
- **MySQL2**: Driver de conexão moderna para MySQL com suporte completo a Promises e Pools de conexão.
- **BcryptJS**: Algoritmo de hash seguro para criptografia das senhas de usuários.
- **JSON Web Tokens (JWT)**: Mecanismo de autenticação stateless e seguro por assinatura para APIs.
- **Cors**: Middleware que permite que o frontend em Angular (ex: na porta `4200`) consuma esta API de forma transparente.
- **Dotenv**: Carregamento de variáveis de ambiente a partir de um arquivo `.env`.
- **Nodemon**: Ferramenta de desenvolvimento para recarregamento automático do servidor a cada modificação no código.

---

## 🏁 Como Rodar a Aplicação Localmente

Siga os passos a seguir para rodar o backend em sua máquina:

### 1. Pré-requisitos
- Para rodar com **Docker**: só precisar ter o **Docker Desktop** instalado e ativo.
- Para rodar **sem Docker**: ter o **Node.js** instalado e um **MySQL Server** rodando localmente.

### 1.1. Rodar tudo com Docker
Se você quiser subir o backend em modo de produção com o MySQL junto, use o compose do backend. Aqui o MySQL é o próprio container do projeto, não precisa instalar nada fora do Docker:

```bash
docker compose up -d --build
```

Isso vai subir:
- a API Node.js em `http://localhost:3000`
- o MySQL 8.4 do próprio projeto em `localhost:3306`

No container, a API usa `DB_HOST=mysql`, `NODE_ENV=production` e inicia apenas depois que o banco fica saudável.

Para ver os logs:

```bash
docker compose logs -f backend
```

Para parar tudo:

```bash
docker compose down
```

Se o MySQL falhar na primeira subida e o volume ficar corrompido, recrie tudo com:

```bash
docker compose down -v
docker compose up -d --build
```

### 2. Configurar o Banco de Dados
#### 2.1. Com Docker
1. Rode `docker compose up -d --build` dentro de `fontes/backend`.
2. O compose sobe o MySQL do projeto, cria o banco `openfeed_db` e executa o script [schema.sql](schema.sql) automaticamente na primeira inicialização.
3. O banco cria as tabelas `usuarios`, `artigos`, `notas` e `agendador_notas`, além de inserir um usuário administrador de teste e um artigo inaugural.
4. Se você já tentou subir antes com erro de inicialização, rode `docker compose down -v` antes de tentar de novo.

#### 2.2. Sem Docker
1. Abra seu cliente MySQL preferido (MySQL Workbench, DBeaver, phpMyAdmin ou terminal).
2. Execute o conteúdo do arquivo [schema.sql](schema.sql) para criar o banco `openfeed_db` e as tabelas.
3. Ajuste o arquivo `.env` com as credenciais do seu MySQL local.

### 3. Configurar as Variáveis de Ambiente
O arquivo `.env` já foi criado com as seguintes configurações padrões. Ele é usado principalmente no modo sem Docker; no Docker, o `docker-compose.yml` injeta as variáveis de produção automaticamente:
```ini
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB_NAME=openfeed_db

JWT_SECRET=sua_chave_secreta_super_segura_do_openfeed_2026
JWT_EXPIRES_IN=1d
```

### 4. Instalar as Dependências e Iniciar sem Docker
Se você quiser rodar diretamente no Node, abra o terminal na pasta `fontes/backend` e execute:

```bash
# Instalar todos os pacotes
npm install

# Iniciar o servidor em modo de desenvolvimento (com restart automático)
npm run dev
```

O servidor estará rodando em: `http://localhost:3000`

### 5. Como funciona na prática
- Com Docker: o backend sobe pronto, lê as variáveis definidas no `docker-compose.yml` e conecta no MySQL do container do projeto.
- Sem Docker: você precisa ter um MySQL rodando localmente, com o banco `openfeed_db` criado pelo [schema.sql](schema.sql) e o arquivo `.env` preenchido com as credenciais corretas.

### 6. Imagens dos artigos
As imagens dos artigos ficam em [public/img/artigos](public/img/artigos). Salve nelas arquivos já otimizados para web, de preferência em `webp` ou `jpg` comprimido.

No banco, o campo `image_url` pode armazenar:
- uma URL externa completa, como `https://...`
- um caminho local relativo, como `/img/artigos/meu-artigo.webp`

Quando o valor for um nome de arquivo simples, a API normaliza automaticamente para `/img/artigos/nome-do-arquivo`.

Se você adicionar ou alterar rotas relacionadas a upload, recrie o backend no Docker para não ficar com imagem antiga:

```bash
docker compose up -d --build --force-recreate backend
```

### 7. Verificação rápida
Depois de subir o backend, acesse:

- `http://localhost:3000/api/health`
- `http://localhost:3000/`

Se a API responder, o backend está funcionando localmente.

---

## 📡 Visão Geral dos Endpoints Criados

A API oferece os seguintes endpoints base sob a rota `/api`:

### Autenticação (`/api/auth`)
- `POST /register`: Cria um novo usuário. Retorna dados do usuário e o token JWT.
- `POST /login`: Valida credenciais. Retorna dados do usuário e token JWT.

### Perfil do Usuário (`/api/users` - Requer token JWT)
- `GET /profile`: Retorna os dados do perfil do usuário logado.
- `PUT /profile`: Atualiza dados do perfil (nome, biografia, avatar).
- `GET /articles`: Retorna todos os artigos publicados exclusivamente pelo usuário logado.

### Artigos (`/api/articles`)
- `GET /`: Retorna a lista de artigos paginados. Aceita parâmetros de busca via query string:
  - `?page=1&limit=10`: Paginação.
  - `?category=Tecnologia`: Filtro de categoria.
  - `?search=Angular`: Busca textual no título, resumo ou conteúdo.
  - `?rating=4.5`: Artigos com nota igual ou superior a esta.
- `GET /:id`: Retorna o artigo completo com informações de seu autor.
- `POST /` (Requer token JWT): Publica um novo artigo vinculando-o ao usuário logado.
- `PUT /:id` (Requer token JWT): Edita o artigo se o usuário logado for o autor dele.
- `DELETE /:id` (Requer token JWT): Remove o artigo permanentemente se o usuário logado for o autor dele.
