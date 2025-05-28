# Projeto-Estoque

Trabalho da disciplina Análise e Projeto de Sistemas (APS) do curso Ciências da Computação 7º semestre do IFCE Maracanaú.

## Visão Geral

Este projeto consiste em um sistema de gestão de estoque com um backend desenvolvido em Java com Spring Boot e um frontend em TypeScript com Next.js e Ant Design.

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

* Java JDK (versão 17 ou superior)
* Apache Maven (versão 3.6 ou superior)
* Node.js (versão 18 ou superior)
* npm (versão 9 ou superior) ou yarn/pnpm/bun

## Configuração

### Backend

1. Navegue até o diretório `server`:

   ```bash
   cd server
   ```

2. (Opcional, mas recomendado) Configure as propriedades do banco de dados em `src/main/resources/application.properties` se não for usar o H2 em memória.

### Frontend

1. Navegue até o diretório `client`:

   ```bash
   cd client
   ```

2. Instale as dependências:

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
