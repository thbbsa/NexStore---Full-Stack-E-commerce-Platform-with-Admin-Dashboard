# 🛒 NexStore - E-commerce Full Stack

Plataforma de e-commerce completa focada em produtos de tecnologia, com área pública para clientes e painel administrativo para gestão do sistema.

> 🚧 Projeto em desenvolvimento — novas funcionalidades, melhorias e otimizações estão sendo implementadas continuamente.

---

## 🌐 Visão Geral

O **NexStore** simula um sistema real de e-commerce, incluindo:

* 🏠 Página inicial com produtos em destaque
* 🔍 Busca e listagem de produtos
* 🛒 Carrinho de compras
* 👤 Autenticação de usuários
* 📦 Processo de checkout (em evolução)
* 🧑‍💼 Dashboard administrativo

---

## 🧑‍💼 Dashboard Admin

Painel completo para gerenciamento da aplicação:

* 📦 CRUD de produtos
* 👥 Gerenciamento de usuários
* ✏️ Edição e atualização de dados
* 📊 Estrutura preparada para expansão (pedidos, relatórios, etc.)

---

## ⚙️ Tecnologias

### Frontend

* React.js
* React Router DOM
* Context API (Gerenciamento de estado do carrinho)
* JavaScript (ES6+)
* CSS3

### Backend

* Node.js
* Express
* SQL Server

---

## 🔐 Autenticação e Segurança

* Sistema de login e registro
* Proteção de rotas com `ProtectedRoute`
* Separação entre usuários comuns e administradores

---

## 🧠 Regras de Negócio

* Um usuário pode possuir múltiplos endereços
* Apenas um endereço pode ser definido como principal
* O carrinho mantém estado global via Context API
* Produtos podem ser gerenciados exclusivamente pelo admin

---

## 📂 Estrutura do Projeto

```
src/
│
├── pages/                # Páginas principais
├── componentes/          # Componentes reutilizáveis
├── context/              # Context API (Carrinho)
├── routes/               # Rotas protegidas
├── services/             # Comunicação com API
└── assets/               # Imagens e estilos
```

---

## 🚀 Como rodar o projeto

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/nexstore

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

---

## 📌 Status do Projeto

* ✔️ Estrutura base do frontend
* ✔️ Sistema de rotas
* ✔️ Carrinho funcional
* ✔️ Dashboard administrativo
* 🔄 Integração completa com backend
* 🔄 Finalização do checkout
* 🔄 Melhorias de UI/UX

---

## 🎯 Objetivo

Projeto desenvolvido com foco em prática real de desenvolvimento full stack, simulando um sistema de e-commerce completo com boas práticas de arquitetura e organização de código.

---

## 📄 Licença

Este projeto é para fins educacionais e de portfólio.
