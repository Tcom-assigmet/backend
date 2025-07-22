import Header from '@/src/components/layout/Header';
import Sidebar from '@/src/components/layout/Sidebar';
import { AlertProvider } from '@/src/components/ui/AlertProvider';
import { FC, ReactNode } from 'react';
interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <AlertProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-[#EAEFEF]"> 
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AlertProvider>
  );
};

export default MainLayout;