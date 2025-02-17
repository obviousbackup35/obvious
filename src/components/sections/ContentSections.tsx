
import { SectionContent } from "./SectionContent";
import type { ContentView } from "@/types/navigation";
import { PolicyMenu } from "../PolicyMenu";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface ContentSectionsProps {
  currentView: ContentView;
  onViewChange: (view: ContentView) => void;
}

type AuthView = "login" | "register" | "forgot-password";

export const ContentSections = ({ currentView, onViewChange }: ContentSectionsProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");

  const handleBack = () => {
    onViewChange('dunes');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      onViewChange('dunes');
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      toast({
        title: "Registro realizado com sucesso",
        description: "Verifique seu email para confirmar o cadastro.",
      });
      setAuthView("login");
    } catch (error: any) {
      toast({
        title: "Erro ao fazer registro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
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
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const AuthContent = () => (
    <div className="flex items-center justify-center h-full">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-xl w-full max-w-md text-white">
        <h1 className="text-2xl font-bold text-center mb-6">
          {authView === "login" && "Login"}
          {authView === "register" && "Criar Conta"}
          {authView === "forgot-password" && "Recuperar Senha"}
        </h1>

        <form onSubmit={
          authView === "login" 
            ? handleLogin 
            : authView === "register" 
              ? handleRegister 
              : handleForgotPassword
        }>
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
              />
            </div>

            {authView !== "forgot-password" && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white"
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm" 
              disabled={loading}
            >
              {loading ? "Carregando..." : (
                authView === "login" 
                  ? "Entrar" 
                  : authView === "register" 
                    ? "Registrar" 
                    : "Enviar Email"
              )}
            </Button>
          </div>
        </form>

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
                Não tem uma conta? Registre-se
              </button>
            </>
          )}
          {(authView === "register" || authView === "forgot-password") && (
            <button
              onClick={() => setAuthView("login")}
              className="text-sm text-white/80 hover:text-white block w-full"
            >
              Já tem uma conta? Faça login
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 w-full h-full z-30">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("/dunes.webp")',
          opacity: currentView === 'dunes' ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          pointerEvents: currentView === 'dunes' ? 'auto' : 'none'
        }}
      >
        <PolicyMenu 
          onViewChange={onViewChange} 
          isVisible={currentView === 'dunes'} 
        />
      </div>
      
      <SectionContent
        isVisible={currentView === 'company'}
        gradient="linear-gradient(to right, #243949 0%, #517fa4 100%)"
        title="Company"
        onBack={handleBack}
      />
      
      <SectionContent
        isVisible={currentView === 'projects'}
        gradient="linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%)"
        title="Projects"
        onBack={handleBack}
      />
      
      <SectionContent
        isVisible={currentView === 'gallery'}
        gradient="linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)"
        title="Gallery"
        onBack={handleBack}
      />
      
      <SectionContent
        isVisible={currentView === 'contact'}
        gradient="linear-gradient(to top, #e6b980 0%, #eacda3 100%)"
        title="Contact"
        onBack={handleBack}
      />

      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
          opacity: currentView === 'auth' ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          pointerEvents: currentView === 'auth' ? 'auto' : 'none'
        }}
      >
        {currentView === 'auth' && <AuthContent />}
      </div>

      {/* Policy Sections */}
      {[
        'privacy', 'terms', 'cookie', 'legal', 'intellectual-property',
        'accessibility', 'refund', 'shipping', 'terms-sale', 'ugc',
        'data-retention', 'cybersecurity', 'ai-policy', 'california-privacy',
        'do-not-sell', 'ethics', 'anti-bribery', 'whistleblower',
        'supplier-code', 'employee-code', 'social-media', 'environmental',
        'sitemap'
      ].map((policy) => (
        <SectionContent
          key={policy}
          isVisible={currentView === policy}
          gradient="linear-gradient(to right, #2c3e50 0%, #3498db 100%)"
          title={policy.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          onBack={handleBack}
        />
      ))}
    </div>
  );
};
