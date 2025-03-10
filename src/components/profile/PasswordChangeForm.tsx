
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PasswordChangeFormProps {
  onCancel: () => void;
}

export const PasswordChangeForm = ({ onCancel }: PasswordChangeFormProps) => {
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
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
      setPasswordLoading(true);
      console.log("Atualizando senha do usuário");
      
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      
      console.log("Senha alterada com sucesso");
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso.",
      });
      
      setPassword("");
      setConfirmPassword("");
      onCancel();
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error.message);
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Falha ao alterar senha",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <form onSubmit={handlePasswordChange} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">Nova senha</Label>
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
        <Label htmlFor="confirmPassword" className="text-white">Confirmar senha</Label>
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
      
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          className="flex-1 bg-white/10 text-white hover:bg-white/20 border-white/30"
        >
          Cancelar
        </Button>
        
        <Button 
          type="submit" 
          className="flex-1 bg-white text-black hover:bg-white/90"
          disabled={passwordLoading}
        >
          {passwordLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </div>
    </form>
  );
};
