import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('components/Home/Home.tsx'),
  route('form-test', 'components/FormTest/FormTest.tsx'),
  route('about', 'components/About/About.tsx'),
] satisfies RouteConfig
