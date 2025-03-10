
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AuthFormProps } from "./types";

export const LoginForm = ({ onViewChange, loading, setLoading }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Helper to check the current URL parameters for any errors
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const errorCode = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    
    if (errorCode) {
      console.error("Error in URL params:", errorCode, errorDescription);
      toast({
        title: "Erro de autenticação",
        description: errorDescription || "Ocorreu um erro durante a autenticação",
        variant: "destructive",
      });
    }
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };
    
    if (!email) {
      newErrors.email = "Email é obrigatório";
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = "Senha é obrigatória";
      isValid = false;
    }
    
    setErrors(newErrors);
    setSubmitAttempted(true);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log("Validação do formulário falhou");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Tentativa de login com:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro de login:", error);
        throw error;
      }
      
      console.log("Login bem-sucedido:", data.user?.id);
      console.log("Dados da sessão:", data.session?.access_token ? "Token presente" : "Sem token");
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo(a) de volta!",
      });
      
      // Clear form
      setEmail("");
      setPassword("");
      
      // O redirecionamento acontecerá automaticamente via o useEffect na página Auth
    } catch (error: any) {
      console.error("Erro detalhado de login:", error);
      
      let errorMessage = "Falha ao fazer login";
      
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou senha incorretos";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Por favor, confirme seu email antes de fazer login";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Erro de login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6 text-white">Entrar</h1>
      
      <form onSubmit={handleLogin}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (submitAttempted) validateForm();
              }}
              className={`bg-white/20 border-white/30 text-white placeholder:text-white/50 ${
                errors.email ? "border-red-400" : ""
              }`}
              autoComplete="email"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (submitAttempted) validateForm();
              }}
              className={`bg-white/20 border-white/30 text-white ${
                errors.password ? "border-red-400" : ""
              }`}
              autoComplete="current-password"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

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
            ) : "Entrar"}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center space-y-2">
        <button
          onClick={() => onViewChange("forgot-password")}
          className="text-sm text-white/80 hover:text-white block w-full"
        >
          Esqueceu sua senha?
        </button>
        <button
          onClick={() => onViewChange("register")}
          className="text-sm text-white/80 hover:text-white block w-full"
        >
          Não tem uma conta? Cadastre-se
        </button>
      </div>
    </>
  );
};
