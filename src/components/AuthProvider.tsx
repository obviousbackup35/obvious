
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  sessionInitialized: boolean;
  signOut: () => Promise<void>;
  lastError: AuthError | null;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null,
  session: null,
  loading: true,
  sessionInitialized: false,
  signOut: async () => {},
  lastError: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const [lastError, setLastError] = useState<AuthError | null>(null);

  // Sign out helper function
  const signOut = async () => {
    try {
      setLoading(true);
      console.log("Iniciando processo de logout...");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erro ao desconectar:", error);
        setLastError(error);
        toast({
          title: "Erro ao desconectar",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Logout bem-sucedido");
        // The onAuthStateChange event will handle state updates
      }
    } catch (err) {
      console.error("Erro inesperado ao desconectar:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if there's an active session
    const initSession = async () => {
      try {
        console.log("Iniciando sessão de autenticação...");
        setLoading(true);
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao buscar sessão:", error);
          setLastError(error);
          toast({
            title: "Erro de autenticação",
            description: "Não foi possível recuperar a sessão: " + error.message,
            variant: "destructive",
          });
        } else {
          console.log("Dados da sessão:", data.session ? "Sessão existe" : "Sem sessão ativa");
          
          if (data.session) {
            console.log("Usuário autenticado:", data.session.user.email, "ID:", data.session.user.id);
            setUser(data.session.user);
            setSession(data.session);
          } else {
            console.log("Nenhuma sessão ativa encontrada");
            setUser(null);
            setSession(null);
          }
        }
      } catch (err) {
        console.error("Erro inesperado ao recuperar sessão:", err);
      } finally {
        setLoading(false);
        setSessionInitialized(true);
      }
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Estado de autenticação alterado:", event, newSession ? "Sessão existe" : "Sem sessão");
      
      if (newSession) {
        console.log("Usuário na nova sessão:", newSession.user.email, "ID:", newSession.user.id);
      }
      
      if (event === 'PASSWORD_RECOVERY') {
        console.log("Recuperação de senha detectada");
      }
      
      if (event === 'SIGNED_IN') {
        console.log("Usuário conectado:", newSession?.user.email);
        setUser(newSession?.user ?? null);
        setSession(newSession);
        
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${newSession?.user.email}!`,
        });
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("Usuário desconectado");
        setUser(null);
        setSession(null);
        
        toast({
          title: "Desconectado",
          description: "Você saiu da sua conta",
        });
      }

      if (event === 'USER_UPDATED') {
        console.log("Usuário atualizado");
        if (newSession) {
          setUser(newSession.user);
          setSession(newSession);
        }
      }
      
      if (event === 'TOKEN_REFRESHED') {
        console.log("Token atualizado");
        if (newSession) {
          setUser(newSession.user);
          setSession(newSession);
        }
      }
      
      setLoading(false);
      setSessionInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    session,
    loading,
    sessionInitialized,
    signOut,
    lastError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
