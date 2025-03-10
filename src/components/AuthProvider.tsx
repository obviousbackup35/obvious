
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  sessionInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null,
  session: null,
  loading: true,
  sessionInitialized: false 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  useEffect(() => {
    // Check if there's an active session
    const initSession = async () => {
      try {
        console.log("Iniciando sessão de autenticação...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao buscar sessão:", error);
          toast({
            title: "Erro de autenticação",
            description: "Não foi possível recuperar a sessão",
            variant: "destructive",
          });
        } else {
          console.log("Dados da sessão:", data.session ? "Sessão existe" : "Sem sessão ativa");
          if (data.session) {
            console.log("Usuário autenticado:", data.session.user.email);
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
        console.log("Usuário na nova sessão:", newSession.user.email);
      }
      
      if (event === 'PASSWORD_RECOVERY') {
        console.log("Recuperação de senha detectada");
      }
      
      if (event === 'SIGNED_IN') {
        console.log("Usuário conectado:", newSession?.user.email);
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${newSession?.user.email}!`,
        });
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("Usuário desconectado");
        toast({
          title: "Desconectado",
          description: "Você saiu da sua conta",
        });
      }

      if (event === 'USER_UPDATED') {
        console.log("Usuário atualizado");
      }
      
      setUser(newSession?.user ?? null);
      setSession(newSession);
      setLoading(false);
      setSessionInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    session,
    loading,
    sessionInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
