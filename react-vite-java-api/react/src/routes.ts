import { redirect, type RouteObject } from 'react-router';
import Login from './components/Login';
import RequireAuth from './components/RequireAuth';
import RootLayout from './components/RootLayout';
import UserPage from './components/user/UserPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: RootLayout,
    children: [
      // "/" -> login page
      { index: true, Component: Login },

      // protected area
      {
        Component: RequireAuth,
        children: [{ path: 'user', Component: UserPage }],
      },

      // anything else falls back to the login page
      { path: '*', loader: () => redirect('/') },
    ],
  },
];

export default routes;
