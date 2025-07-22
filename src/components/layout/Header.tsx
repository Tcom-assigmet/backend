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
    <header className={`bg-primary border-b border-border h-16 px-6 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-8">
        <div className="flex items-center">
          <span className="text-xl font-bold text-primary-foreground">EQS-dba</span>
        </div>
        
        <div className="relative">
          <div className="flex items-center relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-64 rounded-full border border-border focus:outline-none focus:ring-1 focus:ring-ring bg-card"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell size={20} className="text-primary-foreground" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-accent text-primary">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm text-primary-foreground font-medium">{user.name}</span>
            <span className="text-xs text-accent">{user.role}</span>
          </div>
          <ChevronDown size={16} className="text-accent" />
        </div>
      </div>
    </header>
  );
};

export default Header;
