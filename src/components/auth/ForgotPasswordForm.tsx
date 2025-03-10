
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AuthFormProps } from "./types";

export const ForgotPasswordForm = ({ onViewChange, loading, setLoading }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email é obrigatório");
      toast({
        title: "Email obrigatório",
        description: "Digite seu email para redefinir sua senha",
        variant: "destructive",
      });
      return;
    }
    
    // Reset error state
    setError(null);
    
    try {
      setLoading(true);
      console.log("Enviando solicitação de redefinição de senha para:", email);
      
      // Get the current origin for redirect URL
      const origin = window.location.origin;
      const redirectUrl = `${origin}/auth?type=recovery`;
      console.log("URL de redirecionamento:", redirectUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;
      
      console.log("Email de redefinição enviado com sucesso");
      setEmailSent(true);
      
      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir sua senha.",
      });
      
      // Don't redirect immediately, show success message first
      setTimeout(() => {
        onViewChange("login");
      }, 3000);
    } catch (error: any) {
      console.error("Erro ao enviar email:", error.message);
      setError(error.message);
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Falha ao enviar email de recuperação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6 text-white">Recuperação de Senha</h1>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {emailSent ? (
        <div className="bg-green-500/20 border border-green-500/50 text-white p-4 rounded-md mb-4 text-center">
          <p className="mb-2">Email de recuperação enviado!</p>
          <p className="text-sm">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
          <p className="text-sm mt-2">Redirecionando para a página de login...</p>
        </div>
      ) : (
        <form onSubmit={handleForgotPassword}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                autoComplete="email"
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
              ) : "Enviar Email"}
            </Button>
          </div>
        </form>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={() => onViewChange("login")}
          className="text-sm text-white/80 hover:text-white block w-full"
        >
          Voltar para o login
        </button>
      </div>
    </>
  );
};
