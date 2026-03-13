import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';

export function TopNav() {
  const { user, logout } = useAuth();

  return (
    <div className="fixed top-6 right-6 z-[60] flex items-center gap-4">
      {user ? (
        <>
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 border border-brand-primary/50 text-brand-primary font-mono text-xs uppercase tracking-widest hover:bg-brand-primary hover:text-brand-dark transition-colors duration-300 rounded-sm shadow-[0_0_10px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]"
          >
            <LayoutDashboard size={14} /> Dashboard
          </Link>
          <button 
            onClick={() => logout()} 
            className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-500 font-mono text-xs uppercase tracking-widest hover:bg-red-500/10 transition-colors duration-300 rounded-sm"
          >
            <LogOut size={14} /> Logout
          </button>
        </>
      ) : (
        <>
          <Link 
            to="/login" 
            className="flex items-center gap-2 px-4 py-2 border border-brand-secondary/50 text-brand-secondary font-mono text-xs uppercase tracking-widest hover:bg-brand-secondary/10 transition-colors duration-300 rounded-sm"
          >
            <LogIn size={14} /> Log In
          </Link>
          <Link 
            to="/signup" 
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 border border-brand-primary/50 text-brand-primary font-mono text-xs uppercase tracking-widest hover:bg-brand-primary hover:text-brand-dark transition-colors duration-300 rounded-sm shadow-[0_0_10px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]"
          >
            <UserPlus size={14} /> Sign Up
          </Link>
        </>
      )}
    </div>
  );
}
