# Comandos Utilizados
Para a criação inicial.
> create react 19.2 typescript vite app. Install Jest, Axios, react-dom. Route dom route being framework.

Pedi para criar componentes
> create a folder components with:
>  - home component, that will have a counter.
> - formTest component, that has a form with a textfield called name, a select combo called sex (values allowed male, female, other), textfield called age, textarea called observation.
> - about component, explaining how beautiful life is and so you. Give me a good text
>
> create it to use framework mode of react dom, pointing to those components.

Pedi para criar arquivo do react-dom de rotas (routes.ts), e adicionar os componentes criados. Aqui ele sumiu com main.tsx e index.tsx e preferiu deixar apenas root.tsx.
> create react-dom routes based on components

Componentes ficaram bagunçados, então pedi que corrigisse isso.
> inside components create a folder for each one

Neste momento, erro sonar no componente FormTeste (tem um form). Devido a ser React versão 19.2, o FormEvent foi depreciado. Então pedi para a IA tentar arrumar.
> fix sonar of FormTest

IA não detectou o erro, e pediu explicação. Informei.
> 'FormEvent' is deprecated

IA se perdeu e pedi logo pra mudar para Form Actions (novo no React 19). Com isso, resolvi meu problema do sonar esta reclamando.
> change handleSubmit to use form actions

Para testar, pedi que deixasse os valores do formulário após submeter, momento em que ele passou a usar o hook useState
> on FormTest, keep the values after submitting

Depois pedi para validar alguns campos do formulário.
> put a validation to check if age is bigger then 30 and name has more than 2 caracters. Show the validation error message on page (if there's any)

O formulário não tinha botão de limpar, então pedi um
> create a button to clean form values

As cores dos botões estavam bem ruins, então pedi para alterar.
> buttom Submit to have background color red and font color white, and clear button to have black border and font

# Aqui foi o README.md que a IA criou a meu pedido
### react-jest-ai-test
A small React 19 sandbox app used to try out React Router's **Framework Mode** (SPA), React 19 form actions, and a Jest + Testing Library test setup.

### What is in here
Three pages, wired up with React Router Framework Mode routing (see `src/routes.ts`):

- **Home** (`/`) — a counter built with `useState`.
- **Form Test** (`/form-test`) — a form (name, sex, age, observation) built with React 19's `useActionState` and native form actions, including client-side validation (name > 2 characters, age > 30) with inline error messages, and a Clear button to reset the fields.
- **About** (`/about`) — a short static page.

Each page component lives in its own folder under `src/components/`, alongside its stylesheet and test file.

The app shell (`<html>`, nav, `<Outlet />`) lives in `src/root.tsx`.

### Tech stack
- [React 19](https://react.dev/) + [React Router 8](https://reactrouter.com/) (Framework Mode, SPA/`ssr: false`)
- [Vite](https://vite.dev/) as the dev server and bundler
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/) for component tests
- [Oxlint](https://oxc.rs/) for linting

### Scripts
```bash
npm run dev       # start the dev server
npm run build     # type-check and build for production
npm run preview   # preview the production build
npm test          # run the Jest test suite
npm run lint      # run Oxlint
```
