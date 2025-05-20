'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

const AuthContext = createContext({
  user: null,
  session: null,
  isLoading: true,
});

export function AuthProvider({ children, initialSession }) {
  const [session, setSession] = useState(initialSession);
  const [user, setUser] = useState(initialSession?.user || null);
  const [isLoading, setIsLoading] = useState(!initialSession);

  useEffect(() => {
    // Set up the auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        setIsLoading(false);
      }
    );

    // Initial fetch of session if not provided
    if (!initialSession) {
      (async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setIsLoading(false);
      })();
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [initialSession]);

  const value = {
    user,
    session,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};