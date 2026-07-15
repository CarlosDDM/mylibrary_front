# MyLibrary — Front

Front-end da MyLibrary: uma aplicação para catalogar e gerenciar uma biblioteca pessoal — **séries**, **obras**, **franquias**, **autores**, **ilustradores** e **usuários**. É uma SPA em Angular, instalável como **PWA** (web manifest + ícones, modo `standalone`).

## Stack

- **Angular 21** (componentes standalone + signals, lazy loading por rota)
- **PrimeNG 21** + `@primeuix/themes`
- **Tailwind CSS 4** (`tailwindcss-primeui`)
- **RxJS** / **TypeScript**
- **Vitest** (+ jsdom) para testes, **ESLint** para lint
- **Docker** + **nginx** para servir em produção

## Estrutura / páginas

Rotas protegidas por guards (`authGuard`, `guestGuard`, `adminGuard`):

- `/home` — dashboard com estatísticas e destaques de séries e obras
- `/series` — listagem paginada de séries com filtros
- `/works` — listagem paginada de obras com filtros
- `/management` — CRUD administrativo (obras, séries, franquias, autores, ilustradores, usuários) — **somente admin**
- `/auth/login` — login

## Requisitos

- Node.js 22+
- npm 11+

## Desenvolvimento

```bash
npm install
npm start   # ng serve -> http://localhost:4200/
```

O app recarrega automaticamente ao editar os arquivos.

## Configuração de ambiente

A configuração de build fica em `src/environments/`. Estes arquivos são **compilados dentro do bundle JavaScript** que vai para o navegador, então só coloque aqui valores públicos (URL do backend, flags). **Nunca coloque segredos** (chaves privadas, tokens, senhas) — eles ficariam visíveis para qualquer usuário no DevTools. Segredos ficam no backend.

| Arquivo | Usado em | Descrição |
| --- | --- | --- |
| `environment.development.ts` | `ng serve` / build de desenvolvimento | Aponta para a API local (`http://localhost:3000`). |
| `environment.ts` | build de produção (`ng build`) | Aponta para a API de produção. |

A troca entre os arquivos é feita automaticamente pelo `fileReplacements` no `angular.json` conforme a configuração do build.

Campos:

- `production`: `true` no build de produção, `false` em desenvolvimento.
- `apiUrl`: URL base do backend, consumida pelo `ApiService` em todas as requisições HTTP.

> **Antes do deploy:** troque o `apiUrl` de `environment.ts` (hoje `https://api.seusite.com`) pela URL real da sua API de produção. Use HTTPS — se o front for servido por HTTPS e a API por HTTP, o navegador bloqueia por *mixed content*.

## Build

```bash
npm run build   # gera dist/mylibrary_front/browser (build de produção por padrão)
```

## Testes e lint

```bash
npm test   # Vitest
npm run lint   # ESLint
```

## Deploy (Docker + nginx)

O projeto já vem com **`Dockerfile`** (multi-stage: build em Node, serve em nginx) e **`nginx.conf`** prontos — a config do nginx já está preparada para o PWA:

- fallback de SPA (`try_files ... /index.html`) para o roteamento do Angular
- `site.webmanifest` servido com `Content-Type: application/manifest+json`
- `index.html` sem cache; assets versionados com cache longo (`immutable`)
- gzip habilitado

```bash
docker build -t mylibrary-front .
docker run -p 8080:80 mylibrary-front   # http://localhost:8080/
```

> Lembre de ajustar o `apiUrl` de produção (ver seção **Configuração de ambiente**) antes de gerar a imagem.
