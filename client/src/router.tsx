import { createBrowserRouter, Navigate } from 'react-router-dom';
import HomePage from './pages/home';
import SignInPage from './pages/sign-in';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/sign-in',
    element: <SignInPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
