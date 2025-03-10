
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AuthFormProps } from "./types";

export const ResetPasswordForm = ({ onBack, loading, setLoading }: AuthFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha ambos os campos de senha",
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
        description: "As senhas que você digitou são diferentes",
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
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi redefinida com sucesso.",
      });
      
      // Automaticamente redireciona de volta para a visualização principal após a redefinição de senha bem-sucedida
      onBack();
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error.message);
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
    </>
  );
};
