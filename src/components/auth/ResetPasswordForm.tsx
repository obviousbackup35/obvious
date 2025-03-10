
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AuthFormProps } from "./types";

export const ResetPasswordForm = ({ onBack, loading, setLoading }: AuthFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    // Reset error
    setError(null);
    
    if (!password || !confirmPassword) {
      setError("Por favor, preencha ambos os campos de senha");
      return false;
    }
    
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }
    
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: error || "Verifique os campos do formulário",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log("Atualizando senha do usuário");
      
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      
      console.log("Senha atualizada com sucesso");
      setSuccess(true);
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi redefinida com sucesso.",
      });
      
      // Redirecionar após um breve atraso
      setTimeout(() => {
        onBack();
      }, 3000);
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error.message);
      setError(error.message);
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
    <>
      <h1 className="text-2xl font-bold text-center mb-6 text-white">Redefinir Senha</h1>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="bg-green-500/20 border border-green-500/50 text-white p-4 rounded-md mb-4 text-center">
          <p className="mb-2">Senha redefinida com sucesso!</p>
          <p className="text-sm">Você pode fazer login com sua nova senha agora.</p>
          <p className="text-sm mt-2">Redirecionando para a página de login...</p>
        </div>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white"
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white"
                autoComplete="new-password"
              />
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
              ) : "Redefinir Senha"}
            </Button>
          </div>
        </form>
      )}
    </>
  );
};
