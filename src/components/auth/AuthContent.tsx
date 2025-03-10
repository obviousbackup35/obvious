
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";

type AuthView = "login" | "register" | "forgot-password" | "reset-password";

interface AuthContentProps {
  onBack: () => void;
}

export const AuthContent = ({ onBack }: AuthContentProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");
  const isMobile = useIsMobile();
  const location = useLocation();

  // Check for password reset parameters in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    
    if (type === "recovery") {
      setAuthView("reset-password");
    }
  }, [location]);

  // Clear form fields when changing views
  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, [authView]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha para continuar",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      onBack();
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Falha ao fazer login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha para continuar",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Verifique seu email para confirmar o cadastro.",
      });
      setAuthView("login");
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Falha ao criar conta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Digite seu email para redefinir a senha",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}?view=reset-password`,
      });

      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir sua senha.",
      });
      setAuthView("login");
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Falha ao enviar email de recuperação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha ambos os campos de senha",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas são diferentes",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi redefinida com sucesso.",
      });
      
      // Automatically redirect back to main view after successful password reset
      onBack();
    } catch (error: any) {
      toast({
        title: "Erro ao redefinir senha",
        description: error.message || "Falha ao atualizar senha",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md mx-4 text-white relative">
        <button
          onClick={onBack}
          className="absolute left-4 top-4 text-white/60 hover:text-white transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-bold text-center mb-6">
          {authView === "login" && "Entrar"}
          {authView === "register" && "Criar Conta"}
          {authView === "forgot-password" && "Recuperar Senha"}
          {authView === "reset-password" && "Redefinir Senha"}
        </h1>

        <form onSubmit={
          authView === "login" 
            ? handleLogin 
            : authView === "register" 
              ? handleRegister 
              : authView === "forgot-password"
                ? handleForgotPassword
                : handleResetPassword
        }>
          <div className="space-y-4">
            {/* Only show email field if not resetting password */}
            {authView !== "reset-password" && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={authView !== "reset-password"}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  autoComplete="email"
                />
              </div>
            )}

            {/* Show password field for login, register and reset password */}
            {(authView === "login" || authView === "register" || authView === "reset-password") && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={authView !== "forgot-password"}
                  className="bg-white/20 border-white/30 text-white"
                  autoComplete={authView === "login" ? "current-password" : "new-password"}
                />
              </div>
            )}

            {/* Show confirm password field for reset password */}
            {authView === "reset-password" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={authView === "reset-password"}
                  className="bg-white/20 border-white/30 text-white"
                  autoComplete="new-password"
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                authView === "login" 
                  ? "Entrar" 
                  : authView === "register" 
                    ? "Cadastrar" 
                    : authView === "forgot-password"
                      ? "Enviar Email"
                      : "Redefinir Senha"
              )}
            </Button>
          </div>
        </form>

        {/* Don't show the links when on reset password view */}
        {authView !== "reset-password" && (
          <div className="mt-4 text-center space-y-2">
            {authView === "login" && (
              <>
                <button
                  onClick={() => setAuthView("forgot-password")}
                  className="text-sm text-white/80 hover:text-white block w-full"
                >
                  Esqueceu sua senha?
                </button>
                <button
                  onClick={() => setAuthView("register")}
                  className="text-sm text-white/80 hover:text-white block w-full"
                >
                  Não tem uma conta? Cadastre-se
                </button>
              </>
            )}
            {(authView === "register" || authView === "forgot-password") && (
              <button
                onClick={() => setAuthView("login")}
                className="text-sm text-white/80 hover:text-white block w-full"
              >
                Já tem uma conta? Entrar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
