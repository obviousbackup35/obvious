
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ChevronLeft, Loader2, UserCircle, Mail, Key } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileSectionProps {
  isVisible: boolean;
  onBack: () => void;
}

export const ProfileSection = ({ isVisible, onBack }: ProfileSectionProps) => {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { user } = useAuth();
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Logout bem-sucedido",
        description: "Você saiu da sua conta",
      });
      onBack();
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message || "Falha ao fazer logout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
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
      setPasswordLoading(true);
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso.",
      });
      
      setPassword("");
      setConfirmPassword("");
      setShowPasswordChange(false);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Falha ao alterar senha",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const sendResetPasswordEmail = async () => {
    if (!user?.email) return;
    
    try {
      setPasswordLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}?view=reset-password`,
      });

      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir sua senha.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Falha ao enviar email de recuperação",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div 
      className="absolute inset-0 w-full h-full bg-black"
      style={{ 
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <button 
        onClick={onBack}
        className="absolute left-8 top-36 text-white hover:opacity-70 transition-opacity p-3"
        aria-label="Voltar"
      >
        <ChevronLeft size={40} />
      </button>

      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Perfil</h2>
          
          {user && (
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-3 text-white/90 text-lg mb-2">
                <UserCircle size={24} />
                <p className="text-white font-medium">Conta</p>
              </div>
              
              <div className="flex items-center gap-3 text-white/90 text-lg mb-4">
                <Mail size={20} />
                <p className="text-white font-medium">{user.email}</p>
              </div>
              
              {!showPasswordChange ? (
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordChange(true)}
                  className="w-full bg-white/10 text-white hover:bg-white/20 border-white/30"
                >
                  <Key className="mr-2 h-5 w-5" />
                  Alterar senha
                </Button>
              ) : (
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
                      onClick={() => setShowPasswordChange(false)}
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
              )}
            </div>
          )}
          
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
              "Sair da conta"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
