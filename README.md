# Athena Students Union — Frontend

Interface web multi-institucional da plataforma Athena Students Union, voltada para gestão educacional de instituições de ensino.

## Visão geral

O frontend conecta alunos, professores e coordenadores em uma única plataforma whitelabel. Cada instituição acessa o sistema pelo próprio segmento de rota (`/[institution]/`), com identidade visual e permissões isoladas por tenant.

## Funcionalidades principais

- **Autenticação** via Identity (JWT + Keycloak), com controle de permissões por instituição
- **Disciplinas** — criação, edição e gerenciamento de carga horária e créditos
- **Turmas e aulas** — configuração de grade, horários e salas
- **Lançamento de notas** — com suporte a fórmulas de avaliação customizadas
- **Frequência** — registro e visualização de presença por aula
- **Edições de programa** — calendário acadêmico, períodos, matrículas e publicação
- **Notificações** — envio por role ou usuário específico
- **Assistente IA** — chat em tempo real com streaming SSE, integrado ao backend de IA

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router + Turbopack) |
| UI | React 19, Tailwind CSS 4, Radix UI |
| Estado global | Zustand |
| Formulários | React Hook Form + Zod |
| Animações | Framer Motion |
| Ícones | Lucide React |

## Arquitetura

Toda rota de aplicação vive dentro de `app/[institution]/`, garantindo isolamento multi-tenant. Cada funcionalidade é um módulo autocontido em `features/`, com seus próprios componentes, hooks, serviços e tipos. O padrão `serviceFactory` permite alternar entre implementações mock e reais sem alterar componentes.

```
src/
├── app/[institution]/   # Rotas da aplicação (multi-tenant)
├── components/          # Componentes UI reutilizáveis
├── entities/            # Stores Zustand
├── features/            # Módulos por domínio (autocontidos)
├── lib/                 # Utilitários (cn, serviceFactory)
└── seeds/               # Dados mock para desenvolvimento
```

## Repositórios relacionados

| Serviço | Repositório |
|---|---|
| Backend de IA | [athena-union-ai](https://github.com/marceloarauj/athena-union-ai) |
| Identidade | [athena-identity](https://github.com/marceloarauj/athena-identity) |
| Escola / Turmas | [athena-institution-service](https://github.com/marceloarauj/athena-institution-service) |
| Notificações | [athena-union-notification-api](https://github.com/marceloarauj/athena-union-notification-api) |
| Documentação | [athena-docs](https://github.com/marceloarauj/athena-docs) |
