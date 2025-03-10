
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AuthFormProps } from "./types";

export const RegisterForm = ({ onViewChange, loading, setLoading }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", confirm: "" });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "", confirm: "" };
    
    if (!email) {
      newErrors.email = "Email é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = "Senha é obrigatória";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      newErrors.confirm = "As senhas não coincidem";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Iniciando tentativa de registro com:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?type=confirmation`,
        }
      });

      if (error) {
        console.error("Erro de registro:", error);
        throw error;
      }
      
      console.log("Resposta do registro:", data);
      
      if (data?.user) {
        console.log("Registro bem-sucedido para usuário:", data.user.id);
        
        toast({
          title: "Conta criada com sucesso",
          description: "Por favor, verifique seu email para confirmar seu registro.",
        });
        
        // Clear form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        
        // Redirect to login page
        onViewChange("login");
      } else {
        console.warn("Resposta de registro sem dados de usuário:", data);
        toast({
          title: "Algo deu errado",
          description: "Não foi possível criar sua conta. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erro detalhado de registro:", error);
      
      let errorMessage = "Falha ao criar conta";
      
      if (error.message) {
        if (error.message.includes("already registered")) {
          errorMessage = "Este email já está registrado";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Erro de registro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6 text-white">Criar Conta</h1>
      
      <form onSubmit={handleRegister}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
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
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/20 border-white/30 text-white"
              autoComplete="new-password"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white/20 border-white/30 text-white"
              autoComplete="new-password"
            />
            {errors.confirm && <p className="text-red-400 text-sm mt-1">{errors.confirm}</p>}
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
            ) : "Cadastrar"}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => onViewChange("login")}
          className="text-sm text-white/80 hover:text-white block w-full"
        >
          Já tem uma conta? Entre
        </button>
      </div>
    </>
  );
};
