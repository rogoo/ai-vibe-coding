# User Manager

A small React + TypeScript single-page app for managing users, bootstrapped with
[Create React App](https://github.com/facebook/create-react-app). Users are stored by a REST
backend; this repository contains the frontend only.

- **React 19** with **React Router 6** for routing
- **TypeScript**
- Backend calls made with the native `fetch` API — no HTTP client dependency
- Tests with **Jest** and **React Testing Library**

## Requirements

- Node.js 16 or newer
- A running backend exposing the user API on `http://localhost:8080` (see
  [Backend API](#backend-api))

## Getting started

```bash
npm install
```

```bash
npm start
```

The app is served on http://localhost:3000. Requests to `/api/user` are proxied to
`http://localhost:8080` by the dev server, so the backend must be running for the User pages to
load any data.

> The dev server is not started automatically by any tooling in this repo — run `npm start`
> yourself, alongside the backend.

## Scripts

| Command         | What it does                                             |
| --------------- | -------------------------------------------------------- |
| `npm start`     | Starts the dev server on port 3000 with hot reload        |
| `npm test`      | Runs the test suite in watch mode                         |
| `npm run build` | Produces an optimised production bundle in `build/`       |
| `npm run eject` | Ejects the CRA configuration (one-way, rarely needed)     |

## Pages

| Route              | Page     | What it does                                                  |
| ------------------ | -------- | ------------------------------------------------------------- |
| `/`                | —        | Redirects to `/about`                                         |
| `/about`           | About    | Description of the project                                    |
| `/users`           | UserList | Lists users, filters by name and by email, deletes            |
| `/users/new`       | UserForm | Creates a user                                                |
| `/users/:id/edit`  | UserForm | Edits an existing user                                        |
| anything else      | —        | Redirects to `/about`                                         |

`UserForm` backs both create and edit: it switches on the presence of the `:id` route param,
loading the user first when editing.

## Backend API

A user is `{ id: number, name: string, email: string }`. The `id` is assigned by the backend, so
the form only submits `name` and `email`.

| Action | Request                 |
| ------ | ----------------------- |
| List   | `GET /api/user`         |
| Read   | `GET /api/user/{id}`    |
| Create | `POST /api/user`        |
| Update | `PUT /api/user/{id}`    |
| Delete | `DELETE /api/user/{id}` |

All of these live in [`src/api/userApi.ts`](src/api/userApi.ts). A non-OK response is turned into
an `Error` carrying the response body, which the pages render as an inline error message. `204 No
Content` (used by `DELETE`) is handled explicitly, since it has no body to parse.

### Configuring the endpoint

The base URL comes from `REACT_APP_API_URL` in [`.env`](.env), defaulting to `/api/user`. That
relative path is proxied to `http://localhost:8080` by the dev server (see `proxy` in
`package.json`), so the browser never makes a cross-origin request and the backend needs no CORS
configuration.

Set it to an absolute URL instead — `http://localhost:8080/api/user`, or the URL of a deployed
backend — if you want to call the backend directly. That path requires the backend to allow the
`http://localhost:3000` origin. Note that the proxy applies to the dev server only; a production
build always needs an absolute URL.

## Tests

```bash
npm test
```

Watch mode is the default. To run the suite once, as CI would:

```bash
npx react-scripts test --watchAll=false
```

Every component is covered — `App` routing, `Header`, `About`, `UserList` and `UserForm`. The tests
mock `src/api/userApi.ts` with `jest.mock`, so no test performs real network I/O and no backend is
needed to run them. Navigation is asserted by rendering real routers rather than by mocking React
Router hooks. `src/setupTests.ts` registers the `@testing-library/jest-dom` matchers and is loaded
automatically before each test file.

### Known behaviour covered by a test

The users table is rendered behind `!loading && !error`. Because a failed *delete* sets the same
`error` state as a failed *load*, a delete failure currently hides the whole table until the user
presses Reload. `UserList.test.tsx` pins this behaviour down so it cannot change unnoticed.

## Project structure

```
src/
  api/userApi.ts          fetch wrappers for the user endpoints
  components/
    Header.tsx            top bar with the About / User links
    Header.test.tsx
  pages/
    About.tsx             about page
    About.test.tsx
    UserList.tsx          list + filters + delete
    UserList.test.tsx
    UserForm.tsx          shared create / edit form
    UserForm.test.tsx
  types/user.ts           User and UserPayload models
  utils/util.ts           string helpers (digit checks, time mask) — currently unused
  App.tsx                 router and layout
  App.test.tsx
  index.tsx               entry point
  setupTests.ts           jest-dom matchers, loaded before every test
```
