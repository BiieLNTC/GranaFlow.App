# 💸 GranaFlow App

Interface web do **GranaFlow**, uma aplicação de gestão financeira pessoal desenvolvida para oferecer controle, organização e clareza sobre entradas, saídas e comportamento financeiro do usuário.

Este projeto foi construído com foco em **experiência do usuário**, **componentização**, **manutenção** e **integração com a GranaFlowAPI**, formando uma solução completa de front-end + back-end para gerenciamento financeiro.

---

## ✨ Sobre o projeto

O **GranaFlow App** é a camada de interface do ecossistema GranaFlow.  
Aqui é onde o usuário interage com o sistema: acessa dashboards, gerencia transações, categorias, pessoas, filtros, autenticação e visualização dos dados financeiros.

A aplicação foi pensada para entregar uma experiência moderna, responsiva e escalável, servindo como base para evolução contínua do produto.

---

## 🧠 Objetivos do projeto

- Fornecer uma interface moderna para controle financeiro
- Consumir dados da **GranaFlowAPI**
- Melhorar a visualização e organização das informações do usuário
- Facilitar manutenção e crescimento da aplicação
- Criar uma base sólida para novas funcionalidades

---

## 🚀 Funcionalidades esperadas

Entre os principais recursos da aplicação, destacam-se funcionalidades como:

- Autenticação de usuários
- Cadastro e gerenciamento de transações
- Filtros por período
- Visualização de receitas e despesas
- Controle de categorias
- Controle de pessoas vinculadas às transações
- Formulários validados
- Feedback visual para ações do usuário
- Navegação fluida e interface responsiva

---

## 🛠️ Tecnologias utilizadas

Este projeto foi desenvolvido com tecnologias modernas do ecossistema front-end:

- **React**
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/ui**
- **React Hook Form**
- **Zod**
- **Consumo de API REST**
- **Componentização**
- **Gerenciamento de estado com hooks**

> A stack pode variar conforme a evolução do projeto, mas a proposta principal é manter um front-end moderno, organizado e escalável.

---

## 🧱 Estrutura e organização

A aplicação foi planejada para manter separação de responsabilidades entre:

- componentes reutilizáveis
- páginas e rotas
- hooks customizados
- serviços de comunicação com API
- schemas de validação
- utilitários
- constantes
- controle de autenticação

Essa organização facilita:
- manutenção do código
- reaproveitamento de componentes
- evolução das telas
- escalabilidade do projeto

---

## 🎨 Experiência do usuário

O GranaFlow App foi pensado para entregar uma navegação clara e agradável, priorizando:

- layout limpo
- boa legibilidade
- feedback visual de ações
- formulários intuitivos
- responsividade
- consistência entre telas
- fluidez no uso diário

O objetivo não é só “funcionar”, mas também oferecer uma experiência realmente boa para quem usa.

---

## 🔌 Integração com a API

Este projeto consome a **GranaFlowAPI**, responsável por toda a regra de negócio, autenticação, persistência de dados e processamento das informações financeiras.

### Repositório da API
[GranaFlowAPI](https://github.com/BiieLNTC/GranaFlowAPI)

A comunicação entre App e API permite:

- autenticação segura
- leitura e envio de dados
- carregamento de transações
- filtros dinâmicos
- persistência das operações do usuário

---

## ⚙️ Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/BiieLNTC/GranaFlow.App.git
```
### 2. Acesse a pasta do projeto

```bash
cd GranaFlow.App
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo .env.local na raiz do projeto e configure a URL da API.

Exemplo:

``` bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 5. Execute o projeto

``` bash
npm run dev
```

### 6. Acesse no navegador

``` bash
http://localhost:3000
```
