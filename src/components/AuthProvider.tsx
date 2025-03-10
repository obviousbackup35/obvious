
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sessionInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  sessionInitialized: false 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  useEffect(() => {
    // Check if there's an active session
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          toast({
            title: "Authentication Error",
            description: "Failed to retrieve session",
            variant: "destructive",
          });
        } else {
          setUser(data.session?.user ?? null);
        }
      } catch (err) {
        console.error("Unexpected error during session retrieval:", err);
      } finally {
        setLoading(false);
        setSessionInitialized(true);
      }
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      setSessionInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, sessionInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
