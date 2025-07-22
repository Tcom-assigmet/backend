import { FC } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Input } from '@/src/components/ui/input';

interface HeaderProps {
  className?: string;
  user?: {
    name: string;
    initials: string;
    avatar?: string;
    role: string;
  };
}

const Header: FC<HeaderProps> = ({ 
  className,
  user = {
    name: 'Tharaka Bandara',
    initials: 'TB',
    role: 'admin'
  }
}) => {
  return (
    <header className={`bg-[#333446] border-b border-gray-200 h-16 px-6 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-8">
        <div className="flex items-center">
          <span className="text-xl font-bold text-white">EQS-dba</span>
        </div>
        
        <div className="relative">
          <div className="flex items-center relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell size={20} className="text-white" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-teal-600 text-white">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm  text-white font-medium">{user.name}</span>
            <span className="text-xs text-gray-100">{user.role}</span>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;
