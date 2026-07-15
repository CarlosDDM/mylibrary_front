# MylibraryFront

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.9.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

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

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
