import { useUser } from '@/lib/context/user-context';
import { Button } from '@/components/ui/button';
import { FileText, LogOut } from 'lucide-react';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex items-center justify-between h-16 mx-auto px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
              <FileText size={20} />
            </div>
            <span>
              Documents <span className="text-primary">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={signOut}
            >
              <LogOut size={14} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/40">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © 2026 Documents AI. Built with NestJS & React. Built by Yurii
            Stepaniuk
          </p>
        </div>
      </footer>
    </div>
  );
};
