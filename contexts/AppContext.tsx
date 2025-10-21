
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Subject } from '../types';
import { SUBJECTS } from '../constants';

// For toast notifications
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  user: User | null;
  subjects: Subject[];
  recentSubjects: Subject[];
  login: (name: string) => void;
  logout: () => void;
  addRecentSubject: (subjectId: string) => void;
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subjects] = useState<Subject[]>(SUBJECTS);
  const [recentSubjects, setRecentSubjects] = useState<Subject[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load recent subjects from localStorage on initial load
  useEffect(() => {
    try {
      const savedRecentIds = localStorage.getItem('recentSubjects');
      if (savedRecentIds) {
        const ids: string[] = JSON.parse(savedRecentIds);
        const recent = ids.map(id => subjects.find(s => s.id === id)).filter(Boolean) as Subject[];
        setRecentSubjects(recent);
      }
    } catch (error) {
      console.error("Failed to load recent subjects from localStorage", error);
    }
  }, [subjects]);

  const addRecentSubject = (subjectId: string) => {
    setRecentSubjects(prev => {
      const subjectToAdd = subjects.find(s => s.id === subjectId);
      if (!subjectToAdd) return prev;

      const filtered = prev.filter(s => s.id !== subjectId);
      const newRecent = [subjectToAdd, ...filtered].slice(0, 4); // Keep latest 4
      
      try {
        localStorage.setItem('recentSubjects', JSON.stringify(newRecent.map(s => s.id)));
      } catch (error) {
        console.error("Failed to save recent subjects to localStorage", error);
      }
      
      return newRecent;
    });
  };

  const login = (name: string) => {
    setUser({ name, avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${name}` });
  };

  const logout = () => {
    setUser(null);
  };

  const addToast = (message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };
  
  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };


  return (
    <AppContext.Provider value={{ user, subjects, recentSubjects, login, logout, addRecentSubject, toasts, addToast, removeToast }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
