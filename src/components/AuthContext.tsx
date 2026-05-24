import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  avatarSeed?: string;
  progress?: {
    completedLessons: number;
    accuracyRank: string;
    practicedLetters: string[];
  };
}

interface RegisteredUser {
  email: string;
  name: string;
  passwordHash: string;
  avatarSeed?: string;
  progress?: {
    completedLessons: number;
    accuracyRank: string;
    practicedLetters: string[];
  };
}

interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'signup';
  setAuthModalOpen: (open: boolean) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  signup: (email: string, name: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  updateUserProgress: (letters: string[]) => void;
  activeTab: 'learn' | 'practice';
  setActiveTab: (tab: 'learn' | 'practice') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getRegisteredUsers = (): RegisteredUser[] => {
  try {
    const stored = localStorage.getItem('twh_registered_users');
    if (stored) {
      return JSON.parse(stored);
    }
    // Pre-seed matching demo credentials for instant high-fidelity pilot test
    const defaultUser: RegisteredUser = {
      email: 'demo@example.com',
      name: 'Demo Pilot',
      passwordHash: '123456',
      avatarSeed: 'Demo Pilot',
      progress: {
        completedLessons: 2,
        accuracyRank: '91.24%',
        practicedLetters: ['A', 'B']
      }
    };
    localStorage.setItem('twh_registered_users', JSON.stringify([defaultUser]));
    return [defaultUser];
  } catch {
    return [];
  }
};

const saveRegisteredUsers = (users: RegisteredUser[]) => {
  try {
    localStorage.setItem('twh_registered_users', JSON.stringify(users));
  } catch (e) {
    console.error('Error saving registered users:', e);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('twh_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [activeTab, setActiveTab] = useState<'learn' | 'practice'>('learn');

  const login = (email: string, password?: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const registry = getRegisteredUsers();
    const found = registry.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!found) {
      return { success: false, error: 'USER_NOT_FOUND' };
    }

    if (password && found.passwordHash !== password) {
      return { success: false, error: 'INCORRECT_PASSWORD' };
    }

    const loggedUser: User = {
      email: found.email,
      name: found.name,
      avatarSeed: found.avatarSeed || found.name,
      progress: found.progress || {
        completedLessons: 0,
        accuracyRank: '91.24%',
        practicedLetters: []
      }
    };
    setUser(loggedUser);
    localStorage.setItem('twh_user', JSON.stringify(loggedUser));
    return { success: true };
  };

  const signup = (email: string, name: string, password?: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const registry = getRegisteredUsers();
    const alreadyExists = registry.some(u => u.email.toLowerCase() === trimmedEmail);

    if (alreadyExists) {
      return { success: false, error: 'EMAIL_EXISTS' };
    }

    const newUser: RegisteredUser = {
      email: trimmedEmail,
      name: name.trim(),
      passwordHash: password || '',
      avatarSeed: name.trim(),
      progress: {
        completedLessons: 0,
        accuracyRank: '91.24%',
        practicedLetters: []
      }
    };

    const updatedRegistry = [...registry, newUser];
    saveRegisteredUsers(updatedRegistry);

    const loggedUser: User = {
      email: newUser.email,
      name: newUser.name,
      avatarSeed: newUser.avatarSeed,
      progress: newUser.progress
    };
    setUser(loggedUser);
    localStorage.setItem('twh_user', JSON.stringify(loggedUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('twh_user');
  };

  const updateUserProgress = (letters: string[]) => {
    if (!user) return;
    const currentLetters = user.progress?.practicedLetters || [];
    const mergedLetters = Array.from(new Set([...currentLetters, ...letters]));

    const updatedUser: User = {
      ...user,
      progress: {
        completedLessons: mergedLetters.length,
        accuracyRank: '91.24%',
        practicedLetters: mergedLetters
      }
    };
    setUser(updatedUser);
    localStorage.setItem('twh_user', JSON.stringify(updatedUser));

    // Persist this user's unique progress back inside the main user registry array
    try {
      const registry = getRegisteredUsers();
      const updatedRegistry = registry.map(u => {
        if (u.email.toLowerCase() === user.email.toLowerCase()) {
          return {
            ...u,
            progress: updatedUser.progress
          };
        }
        return u;
      });
      saveRegisteredUsers(updatedRegistry);
    } catch (e) {
      console.error('Error updating progress in user registry:', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthModalOpen,
      authMode,
      setAuthModalOpen,
      setAuthMode,
      login,
      signup,
      logout,
      updateUserProgress,
      activeTab,
      setActiveTab
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
