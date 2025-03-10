
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface LogoutButtonProps {
  onLogoutSuccess: () => void;
}

export const LogoutButton = ({ onLogoutSuccess }: LogoutButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      console.log("Iniciando processo de logout");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      console.log("Logout realizado com sucesso");
      
      toast({
        title: "Logout bem-sucedido",
        description: "Você saiu da sua conta",
      });
      onLogoutSuccess();
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error.message);
      toast({
        title: "Erro ao sair",
        description: error.message || "Falha ao fazer logout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      disabled={loading}
      className="w-full bg-white text-black hover:bg-white/90 px-8 text-lg font-semibold h-12"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span>Saindo...</span>
        </>
      ) : (
        "Sair"
      )}
    </Button>
  );
};
