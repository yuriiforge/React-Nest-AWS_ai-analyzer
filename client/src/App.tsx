import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryProvider } from './providers/query-provider';

function App() {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-background font-sans antialiased">
        <RouterProvider router={router} />
      </div>
    </QueryProvider>
  );
}

export default App;
