import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { FC, ReactNode } from 'react';
interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#EAEFEF]"> 
  <Header />
  <div className="flex flex-1 overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      {children}
    </main>
  </div>
</div>
  );
};

export default MainLayout;