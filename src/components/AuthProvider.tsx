
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();

  useEffect(() => {
    // Handle password reset redirects
    const handlePasswordReset = async () => {
      const searchParams = new URLSearchParams(location.search);
      const type = searchParams.get("type");
      
      if (type === "recovery") {
        const accessToken = searchParams.get("access_token");
        
        if (accessToken) {
          try {
            // Set the access token in the session
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: "",
            });
            
            if (error) throw error;
            
            // Notify user to set new password
            toast({
              title: "Redefinição de senha",
              description: "Por favor, defina sua nova senha agora.",
            });
          } catch (err: any) {
            console.error("Erro ao processar redefinição de senha:", err);
            toast({
              title: "Erro na redefinição",
              description: err.message || "Link de redefinição inválido ou expirado",
              variant: "destructive",
            });
          }
        }
      }
    };

    handlePasswordReset();
  }, [location]);

  useEffect(() => {
    // Check if there's an active session
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          toast({
            title: "Erro de autenticação",
            description: "Falha ao recuperar sessão",
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
