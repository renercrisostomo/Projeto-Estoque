# Projeto-Estoque

Projeto de um sistema Web para a disciplina Análise e Projeto de Sistemas (APS) do curso Ciências da Computação 7º semestre do IFCE Maracanaú.

## Visão Geral

Este projeto consiste em um sistema de gestão de estoque com um backend desenvolvido em Java com Spring Boot e um frontend em TypeScript com Next.js e Ant Design.

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

* Java JDK (versão 17 ou superior)
* Apache Maven (versão 3.6 ou superior)
* Node.js (versão 18 ou superior)
* npm (versão 9 ou superior) ou yarn/pnpm/bun
* PostgreSQL

## Configuração

### Backend

1. Navegue até o diretório `server`:

   ```bash
   cd server
   ```

2. Crie um arquivo `.env` na raiz do diretório `server` com as seguintes variáveis de ambiente:

   ```env
   # Configurações do banco de dados
   DB_URL=jdbc:postgresql://localhost:5432/gestor_estoque_db
   DB_USERNAME=postgres
   DB_PASSWORD=admin

   # Configurações do JWT
   JWT_SECRET=sua_chave_secreta
   JWT_EXPIRATION=3600000
   ```

   > **Nota**: Altere `sua_chave_secreta` para uma chave secreta forte e única em produção. Ajuste também o tempo de expiração do JWT conforme necessário.

### Frontend

1. Navegue até o diretório `client`:

   ```bash
   cd client
   ```

2. Crie um arquivo de ambiente local `.env.local`:

   ```plaintext
   # client/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. Instale as dependências:

   ```bash
   npm install
   # ou
   # yarn install
   # ou
   # pnpm install
   # ou
   # bun install
   ```

## Executando a Aplicação

### Backend (Spring Boot)

1. Certifique-se de estar no diretório `server`.

2. Execute o servidor de desenvolvimento Spring Boot:

   ```bash
   ./mvnw spring-boot:run
   ```

   No Windows, se `./mvnw` não funcionar diretamente no PowerShell, você pode usar:

   ```powershell
   cmd /c "mvnw.cmd spring-boot:run"
   ```

   Ou, se você tiver o Maven instalado globalmente:

   ```bash
   mvn spring-boot:run
   ```

   O backend estará disponível em `http://localhost:8080` (ou a porta configurada em `application.properties`).

### Frontend (Next.js)

1. Certifique-se de estar no diretório `client`.

2. Execute o servidor de desenvolvimento Next.js:

   ```bash
   npm run dev
   # ou
   # yarn dev
   # ou
   # pnpm dev
   # ou
   # bun dev
   ```

   Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Funcionalidades Implementadas (Exemplos)

* Autenticação de Usuários (Login/Registro)
* CRUD de Produtos
* CRUD de Fornecedores
* Registro de Entradas e Saídas de Estoque
* Dashboard com visualizações de dados

## Estrutura do Projeto (Simplificada)

```text
projeto-estoque/
├── client/        # Frontend Next.js
│   ├── src/
│   └── ...
├── server/        # Backend Spring Boot
│   ├── src/
│   └── pom.xml
└── README.md
```

## Screenshots

Você pode começar a editar a página modificando o arquivo `app/auth/login/page.tsx`. A página será atualizada automaticamente conforme você edita o arquivo.

![login page printscreen](client/public/login-page-printscreen.png)

![produtos page printscreen](client/public/print-produtos.png)
