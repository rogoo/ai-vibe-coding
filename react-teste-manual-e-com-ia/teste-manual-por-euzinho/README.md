# User Manager

React + TypeScript app bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
It manages users exposed by a REST API at `http://localhost:8080/api/user`.

## Running

```bash
npm start
```

The app runs on http://localhost:3000 and expects the backend on port 8080.

## Pages

- **About** (`/about`) — description of the project.
- **User** (`/users`) — lists every user with filters by name and by email, plus create
  (`/users/new`), edit (`/users/:id/edit`) and delete.

## Backend calls

All calls use the native `fetch` API (`src/api/userApi.ts`):

| Action | Request                 |
| ------ | ----------------------- |
| List   | `GET /api/user`         |
| Read   | `GET /api/user/{id}`    |
| Create | `POST /api/user`        |
| Update | `PUT /api/user/{id}`    |
| Delete | `DELETE /api/user/{id}` |

The endpoint comes from `REACT_APP_API_URL` in `.env`. It defaults to `/api/user`, which the CRA
dev server proxies to `http://localhost:8080` (see `proxy` in `package.json`) so the browser never
makes a cross-origin request. Point it at the absolute URL `http://localhost:8080/api/user` instead
if the backend allows the `http://localhost:3000` origin, or for a deployed backend.

## Structure

```
src/
  api/userApi.ts        fetch wrappers for the user endpoints
  components/Header     top bar with the About / User links
  pages/About.tsx       about page
  pages/UserList.tsx    list + filters + delete
  pages/UserForm.tsx    shared create / edit form
  types/user.ts         User model
```
