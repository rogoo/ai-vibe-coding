import type { ReactNode } from 'react'
import { Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration } from 'react-router'
import './index.css'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>react-jest-ai-test</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <>
      <nav id="site-nav">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/form-test">Form Test</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}
