# Sobre
A parte mais abaixo foi criado pelo meu querido **IA Claude Opus**.

No vibing code algumas coisas sairam erradas.

O link da tela de login aparecia mesmo já tento logado, e é ilógico já que foi criado o botão de Sign Out. Também o botão usuário eu preferia que aparecesse desabilitado. Pedi alteração e a IA corrigiu.

Os forms estavam usando FormEvent, e o Sonar reclama na versão React 19. Pedi para trocar para SubmitEvent.

Na chamada ao API, não aparecia a mensagem de erro retornada pelo API, preferi corrigir manualmente.

Com erro de cors, tive que corrigir o API para aceitar ambas portas 5173 e 4173 (fiz teste usando build/preview).


# User Admin

Small React + TypeScript SPA to manage users: a login screen and a CRUD screen backed by a REST API.

Built with Vite 8, React 19, React Router 8 (data router), axios and [sonner](https://sonner.emilkowal.ski/) for toast messages.

## Requirements

- Node.js 20.19+ / 22.12+ (developed on 24)
- A backend exposing `/api/user` (see [API](#api))

## Getting started

```bash
npm install
```

```bash
npm run dev
```

The app runs at http://localhost:5173.

Sign in with the built-in credentials:

| Login   | Password   |
| ------- | ---------- |
| `rogoo` | `admin123` |

> Authentication is hard-coded in [`src/components/Login.tsx`](src/components/Login.tsx) for demo purposes. There is no token and no server-side check — do not use this as-is in production.

## Scripts

| Command           | What it does                               |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Dev server with HMR (mode `development`)   |
| `npm run build`   | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally            |
| `npm run lint`    | Run Oxlint                                 |

## Routes

Routes are declared as data-router objects in [`src/routes.ts`](src/routes.ts):

| Path    | Screen                  | Access                                      |
| ------- | ----------------------- | ------------------------------------------- |
| `/`     | Login                   | Public; redirects to `/user` when signed in |
| `/user` | User list + search form | Signed-in only                              |
| `*`     | Redirects to `/`        | —                                           |

`RootLayout` wraps every route with the auth provider, the `<Toaster />` and the header. `RequireAuth` is a pathless layout route that bounces anonymous visitors back to `/`.

## Project structure

```
src/
├── api/
│   └── userApi.ts        axios instance (base URL by mode) + error-message helper
├── components/
│   ├── Header.tsx        nav links, signed-in user, logout
│   ├── Login.tsx         login form with show/hide password toggle
│   ├── RequireAuth.tsx   guard route
│   ├── RootLayout.tsx    AuthProvider + Toaster + Header + <Outlet />
│   └── user/
│       ├── User.tsx      search form + user table
│       ├── UserDetail.tsx  modal used for both insert and edit
│       └── UserPage.tsx  route component; mounts the UserProvider
├── provider/
│   ├── AuthContext.ts    auth context + useAuth()
│   ├── AuthProvider.tsx  sign in / sign out state
│   ├── UserContext.ts    user context + useUsers()
│   └── UserProvider.tsx  all axios calls, all toasts
├── types/
│   ├── events.ts         FormSubmitEvent (synthetic wrapper over DOM SubmitEvent)
│   └── user.ts           User, UserInput, UserFilter
└── routes.ts             route definitions
```

## User screen

The form at the top drives the list:

- **Search** — filters by name and/or e-mail (sent as query params; blank fields are omitted)
- **Clean** — clears both fields and reloads the full list
- **Add New** — opens `UserDetail` in insert mode

Each row has **Edit** (opens `UserDetail` pre-filled) and **Delete** (asks for confirmation first). `UserDetail` serves both modes: `user={null}` inserts, `user={someUser}` edits. It is keyed by id in `User.tsx`, so it remounts with fresh values when switching rows, and it focuses the Name field on open.

All network results — success and failure — are reported through sonner toasts raised in `UserProvider`.

## API

The app expects a REST resource at the configured base URL:

| Method   | Path    | Purpose                                            |
| -------- | ------- | -------------------------------------------------- |
| `GET`    | `/`     | List users; optional `name` / `email` query params |
| `POST`   | `/`     | Create a user; returns the created `User`          |
| `PUT`    | `/{id}` | Update a user                                      |
| `DELETE` | `/{id}` | Delete a user                                      |

A user is:

```ts
interface User {
  id: number;
  name: string;
  email: string;
}
```

Error responses are unwrapped by `toErrorMessage` in [`src/api/userApi.ts`](src/api/userApi.ts), which prefers a string body or a `{ "message": "..." }` field before falling back to a generic message.

### Switching dev / prod

The base URL comes from `VITE_API_URL`, loaded by Vite from the env file matching the build mode:

| Mode          | File               | Base URL                         |
| ------------- | ------------------ | -------------------------------- |
| `development` | `.env.development` | `http://localhost:8080/api/user` |
| `production`  | `.env.production`  | `http://localhost:8081/api/user` |

`npm run dev` uses `development`; `npm run build` uses `production`. Force either explicitly:

```bash
npm run dev -- --mode production
```

Vite inlines the value **at build time**, so editing an env file requires a rebuild (or a dev-server restart) to take effect — a deployed bundle cannot be repointed with a runtime environment variable. For a local override that is not committed, create `.env.local`; it wins over both files and is already git-ignored.

If `VITE_API_URL` is missing, [`src/api/userApi.ts`](src/api/userApi.ts) falls back to the two URLs above based on `import.meta.env.PROD`.

Note that both defaults point at `localhost`, so a real deployment needs a proper hostname in `.env.production`. Only variables prefixed `VITE_` reach client code — and everything that does is visible in the browser, so keep secrets out of them.

## Notes

- `CLAUDE.local.md` holds local agent instructions and is git-ignored.
- CORS: the API must allow the origin the app is served from (`http://localhost:5173` in dev).
