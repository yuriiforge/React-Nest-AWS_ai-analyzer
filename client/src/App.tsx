import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryProvider } from './providers/query-provider';
import { UserProvider } from './lib/context/user-provider';

function App() {
  return (
    <QueryProvider>
      <UserProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <RouterProvider router={router} />
        </div>
      </UserProvider>
    </QueryProvider>
  );
}

export default App;
