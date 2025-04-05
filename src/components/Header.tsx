
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-xl text-hackathon-red">LAKSHAGRIHA</span>
          <span className="bg-hackathon-yellow text-hackathon-dark text-xs font-semibold px-2 py-0.5 rounded">
            4.0
          </span>
          <span className="hidden md:inline-block text-sm text-muted-foreground ml-2">
            Hackathon Evaluation System
          </span>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-hackathon-blue flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={18} />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
