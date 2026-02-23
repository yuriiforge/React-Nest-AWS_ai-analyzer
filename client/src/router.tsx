import { createBrowserRouter, Navigate } from 'react-router-dom';
import HomePage from './pages/home';
import SignInPage from './pages/sign-in';
import { RootLayout } from './components/root-layout';
import { ProtectedRoute } from './components/protected-route';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <HomePage />,
      },

      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: '/sign-in',
    element: <SignInPage />,
  },
]);
