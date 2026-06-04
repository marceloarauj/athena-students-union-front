# CLAUDE.md — Athena Students Union Front

Guia de padrões e convenções para manutenção e extensão deste projeto.

---

## Visão Geral

Plataforma educacional whitelabel em **Next.js App Router** com suporte a múltiplas instituições via roteamento dinâmico. Cada instituição acessa o sistema pelo prefixo `/:institution/` na URL.

---

## Estrutura de Diretórios

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (ThemeProvider dark/light)
│   ├── globals.css                   # CSS variables + Tailwind
│   └── [institution]/
│       ├── layout.tsx                # Layout por instituição (carrega tema)
│       ├── page.tsx                  # Redirect para /home
│       ├── login/page.tsx            # Tela de login (NÃO MODIFICAR)
│       ├── home/page.tsx
│       ├── profile/page.tsx
│       ├── schedule/page.tsx
│       ├── grades/page.tsx
│       ├── attendance/page.tsx
│       ├── payments/page.tsx
│       ├── grade-entry/page.tsx
│       ├── users/page.tsx
│       ├── send-notification/page.tsx
│       ├── disciplines/page.tsx
│       ├── class-setup/page.tsx
│       ├── support/page.tsx
│       └── settings/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── header/                   # Header global
│   │   ├── drawer/                   # Navegação lateral
│   │   └── theme/                    # Sistema de tema whitelabel
│   └── ui/                           # Componentes de UI reutilizáveis
│
├── entities/
│   ├── institution.ts                # Zustand store da instituição ativa
│   └── userStore.ts                  # Zustand store do usuário logado
│
├── features/                         # Módulos por domínio de negócio
│   └── {nome}/
│       ├── components/
│       ├── hooks/
│       ├── models/
│       └── services/
│
├── lib/
│   ├── utils.ts                      # cn() helper
│   └── serviceFactory.ts             # isMock() helper
│
└── seeds/                            # Dados mock (JSON)
```

---

## Feature Pattern

Cada domínio de negócio é um **módulo de feature** em `src/features/{nome}/`. Nunca coloque lógica de negócio diretamente nas pages.

```
src/features/exemplo/
├── components/
│   └── ExemploCard.tsx
├── hooks/
│   └── useExemplo.ts
├── models/
│   └── exemploModel.ts
└── services/
    ├── exemploInterface.ts     # Interface TypeScript + factory function
    ├── exemploMockService.ts   # Implementação mock (usa seeds/)
    └── exemploService.ts       # Implementação real (chama API)
```

### Convenções

- Componentes: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Modelos: `camelCaseModel.ts`
- Serviços: `camelCaseService.ts` / `camelCaseMockService.ts` / `camelCaseInterface.ts`

---

## Repository / Service Pattern

### 1. Defina a interface + factory em `{nome}Interface.ts`

```typescript
// src/features/exemplo/services/exemploInterface.ts
import { ExemploModel } from '../models/exemploModel';
import { ExemploMockService } from './exemploMockService';
import { ExemploService } from './exemploService';
import { isMock } from '@/lib/serviceFactory';

export interface IExemploService {
  getExemplos(): Promise<ExemploModel[]>;
}

export function getExemploService(institution: string): IExemploService {
  return isMock(institution) ? new ExemploMockService() : new ExemploService();
}
```

### 2. Implemente o Mock com dados de `seeds/`

```typescript
// src/features/exemplo/services/exemploMockService.ts
import { IExemploService } from './exemploInterface';
import { ExemploModel } from '../models/exemploModel';
import data from '@/seeds/exemplos.json';

export class ExemploMockService implements IExemploService {
  async getExemplos(): Promise<ExemploModel[]> {
    return data as ExemploModel[];
  }
}
```

### 3. Implemente o serviço real

```typescript
// src/features/exemplo/services/exemploService.ts
import { IExemploService } from './exemploInterface';
import { ExemploModel } from '../models/exemploModel';

export class ExemploService implements IExemploService {
  async getExemplos(): Promise<ExemploModel[]> {
    const response = await fetch('/api/exemplos');
    return response.json();
  }
}
```

### 4. Use via hook

```typescript
// src/features/exemplo/hooks/useExemplo.ts
'use client';
import { useEffect, useState } from 'react';
import { ExemploModel } from '../models/exemploModel';
import { getExemploService } from '../services/exemploInterface';

export function useExemplo(institution: string) {
  const [data, setData] = useState<ExemploModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const service = getExemploService(institution);
    service.getExemplos().then(result => {
      setData(result);
      setLoading(false);
    });
  }, [institution]);

  return { data, loading };
}
```

### 5. Use na page

```typescript
// src/app/[institution]/exemplo/page.tsx
'use client';
import { useInstitutionStore } from '@/entities/institution';
import { useExemplo } from '@/features/exemplo/hooks/useExemplo';

export default function ExemploPage() {
  const { institution } = useInstitutionStore();
  const { data, loading } = useExemplo(institution?.alias ?? '');
  // ...
}
```

---

## Instituição Mock (`/mock`)

A rota `/mock` é reservada para desenvolvimento e testes **sem backend**. Quando `institution === 'mock'`, todas as factories retornam a implementação mock automaticamente.

```
/mock/login       → login com dados fixos
/mock/home        → feed com posts seed
/mock/grades      → boletim com notas seed
...
```

A lógica de seleção está em `src/lib/serviceFactory.ts`:

```typescript
export function isMock(institution: string | undefined): boolean {
  return institution === 'mock';
}
```

**Nunca** hardcode a escolha mock/real em componentes. Sempre passe `institution` para a factory.

---

## Sistema Whitelabel

### ThemeModel

```typescript
// src/components/layout/theme/theme.ts
type ThemeModel = {
  primary: string;    // Cor primária hex (#2277DD)
  secondary: string;  // Cor secundária hex
  danger: string;     // Cor de perigo hex
  logo?: string;      // Path ou URL da logo
  name?: string;      // Nome da instituição
}
```

### Como funciona

1. `ThemeRepository.getTheme()` lê `src/seeds/theme.json` (server-side)
2. Em produção, sobrescrever `ThemeRepository` para buscar da API pela institution alias
3. `ThemeContainer` injeta as cores como CSS custom properties no `<html>`
4. Tailwind usa `--color-primary`, `--color-secondary`, etc. via `@theme inline`

### Personalizar tema por instituição

Sobrescrever `getTheme()` em `ThemeRepository` para aceitar o `institution` param e buscar o tema correspondente da API ou de seeds diferentes.

### CSS Variables disponíveis

```css
--primary          /* cor primária hex */
--secondary        /* cor secundária hex */
--danger           /* cor de perigo hex */
--background       /* fundo da página */
--foreground       /* texto principal */
--card             /* fundo de cards */
--card-foreground  /* texto em cards */
--muted            /* fundo de elementos sutis */
--muted-foreground /* texto sutil */
--border           /* cor de bordas */
--input            /* fundo de inputs */
```

---

## Roteamento

```
/:institution/login           → tela de login (NÃO MODIFICAR)
/:institution/home            → feed de notícias
/:institution/profile         → perfil do usuário
/:institution/schedule        → calendário letivo
/:institution/grades          → boletim escolar
/:institution/attendance      → registro de chamada
/:institution/payments        → financeiro
/:institution/grade-entry     → diário de classe
/:institution/users           → gerenciar usuários
/:institution/send-notification → enviar notificação
/:institution/disciplines     → disciplinas
/:institution/class-setup     → turmas
/:institution/support         → suporte
/:institution/settings        → configurações
```

---

## Como Adicionar uma Nova Feature

1. Criar `src/features/{nome}/models/{nome}Model.ts` com os tipos
2. Criar `src/features/{nome}/services/{nome}Interface.ts` com interface + factory
3. Criar `src/features/{nome}/services/{nome}MockService.ts` com dados de `src/seeds/`
4. Criar `src/features/{nome}/services/{nome}Service.ts` com chamadas reais
5. Criar `src/features/{nome}/hooks/use{Nome}.ts` usando a factory
6. Criar componentes em `src/features/{nome}/components/`
7. Criar `src/app/[institution]/{rota}/page.tsx` usando o hook
8. Adicionar o item de navegação em `src/components/layout/drawer/drawer.tsx`
9. Adicionar dados mock em `src/seeds/{nome}_data.json`

---

## Estado Global (Zustand)

```typescript
// Instituição ativa
const { institution, setInstitution } = useInstitutionStore();
institution.alias  // ex: "mock", "colegio-estadual"

// Usuário logado
const { user, setUser, clearUser } = useUserStore();
user?.firstName
user?.email
```

---

## Utilitários

```typescript
import { cn } from '@/lib/utils';
// Combina classes Tailwind com merge inteligente
cn('px-4 py-2', isActive && 'bg-primary', className)

import { isMock } from '@/lib/serviceFactory';
// Retorna true se institution === 'mock'
isMock(institution?.alias)
```

---

## Regras Gerais

- **Login**: A tela de login (`src/app/[institution]/login/`) não deve ser modificada sem aprovação explícita
- **Server vs Client**: `layout.tsx` de instituição é server component (carrega tema). Pages que precisam de interatividade usam `'use client'`
- **Sem chamadas diretas ao fetch nas pages**: sempre via serviço/hook da feature
- **Mock data**: nunca use URLs externas (pravatar, unsplash) em produção. Use assets locais em `public/`
- **Ícones**: usar `lucide-react` (já instalado)
- **Animações**: usar `framer-motion`
- **Toasts**: usar `sonner`
- **Validação de forms**: usar `react-hook-form` + `zod`
