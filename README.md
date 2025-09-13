# Twitter Clone

## Autor
Alex Alexandre

## Versão
1.0

## Data
13-09-2025

---

### Descrição do Projeto

O **Twitter** é uma aplicação desenvolvida para aprofundar conhecimentos em Django e React. O projeto é dividido em dois componentes principais:

- **Backend**: Construído com Django Rest Framework, fornecendo uma API robusta para gerenciar usuários, tweets, seguidores e notificações.
- **Frontend**: Desenvolvido em React com integração ao backend via Axios, com estilização usando Tailwind CSS.

O projeto foi implantado utilizando:
- **Backend**: PythonAnywhere.
- **Frontend**: Vercel.

Durante o desenvolvimento, utilizei containers Docker para configurar um ambiente com PostgreSQL, garantindo flexibilidade e escalabilidade no banco de dados durante o desenvolvimento.

---

### Funcionalidades

- **Gerenciamento de Usuários**: Cadastro, autenticação e gerenciamento de perfis.
- **Tweets**: Criação, listagem, edição e exclusão de tweets.
- **Seguidores**: Gerenciamento de relações entre seguidores e seguidos.
- **Notificações**: Atualizações sobre novos seguidores e interações em tweets.
- **Autenticação JWT**: Segurança nos endpoints protegidos.
- **Painel Administrativo**: Interface do Django Admin para gerenciar dados e permissões.

---

### Estrutura do Projeto

#### Backend

- **Framework**: Django 5.1.4.
- **API**: Endpoints organizados com Django Rest Framework.
- **Banco de Dados**: PostgreSQL (em desenvolvimento) e SQLite (em produção).
- **Autenticação**: Implementação de autenticação com JWT.
- **Ferramentas Adicionais**:
  - Django Extensions.
  - WhiteNoise para servir arquivos estáticos em produção.
  - Django Cors Headers para integração entre frontend e backend.

#### Frontend

- **Framework**: React 18.
- **Estilização**: Tailwind CSS.
- **Requisições HTTP**: Axios para comunicação com a API.
- **Roteamento**: React Router.
- **Criptografia**: Crypto-js para manipulação segura de dados.

---

### Configuração do Ambiente de Desenvolvimento

#### Backend

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/diegocavalcanti-dev/twitter.git
   cd twitter/backend

2. **Configurar o Ambiente Virtual**:
    ```bash
    python3.10 -m venv env
    source env/bin/activate

3. **Instalar Dependências**:
    ```bash
    poetry install

4. **Configurar o Banco de Dados**:
    ```bash
    poetry run python manage.py makemigrations
    poetry run python manage.py migrate

5. **Criar um Superusuário**:
    ```bash
    poetry run python manage.py createsuperuser

6. **Rodar o Servidor**:
    ```bash
    poetry run python manage.py runserver

### Frontend

1. **Configurar o Diretório**:
    ```bash
    cd ../frontend

2. **Instalar Dependências**:
    ```bash
    npm install

3. **Configurar Variáveis de Ambiente: Altere o arquivo src/api/base_api.js**:
    export const API_BASE_URL = 'http://localhost:8000'; ou porta 8084

4. **Rodar o Servidor de Desenvolvimento**:
    npm run dev

# Deploy

## Backend
- Implantado no **PythonAnywhere**.
- **Webhook configurado** para atualizações automáticas.

## Frontend
- Hospedado no **PythonAnywhere**.

## Tecnologias Utilizadas

### Backend
- Django Rest Framework
- db.sqlite3
- Poetry
- Docker

### Frontend
- React
- Tailwind CSS
- Axios

# Testes

Para executar os testes automatizados:
    ```bash
    poetry run python manage.py test

# Contribuições
Contribuições são bem-vindas! Caso tenha sugestões ou problemas, sinta-se à vontade para abrir uma issue ou enviar um Pull Request.

Projeto desenvolvido como parte do aprendizado em desenvolvimento Full Stack.
