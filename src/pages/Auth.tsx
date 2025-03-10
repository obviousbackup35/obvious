
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { AuthView } from "@/components/auth/types";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AuthContainer } from "@/components/auth/AuthContainer";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<AuthView>("login");
  const navigate = useNavigate();
  const { user, sessionInitialized } = useAuth();

  // Check for URL parameters
  useEffect(() => {
    console.log("Auth page mounted, checking URL params");
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get("type");
    const errorCode = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    
    console.log("URL params:", { type, errorCode, errorDescription });
    
    if (errorCode) {
      console.error("Error in URL:", errorCode, errorDescription);
      toast({
        title: "Erro de autenticação",
        description: errorDescription || "Ocorreu um erro durante a autenticação",
        variant: "destructive",
      });
    }
    
    if (type === "recovery") {
      console.log("Recovery parameter detected, switching to reset-password view");
      setView("reset-password");
    } else if (type === "confirmation") {
      console.log("Confirmation parameter detected, showing confirmation message");
      toast({
        title: "Email confirmado",
        description: "Seu email foi confirmado com sucesso. Você pode fazer login agora.",
      });
    }
  }, []);

  // Redirect to home if already authenticated
  useEffect(() => {
    console.log("Auth check: sessionInitialized =", sessionInitialized, ", user =", user ? `exists (${user.email})` : "null");
    
    if (sessionInitialized && user) {
      console.log("Usuário autenticado, redirecionando para a página inicial");
      console.log("User ID:", user.id);
      console.log("Email verificado:", user.email_confirmed_at ? "Sim" : "Não");
      
      toast({
        title: "Autenticado",
        description: "Você está conectado como " + user.email,
      });
      navigate("/");
    }
  }, [user, sessionInitialized, navigate]);

  const handleBack = () => {
    console.log("Voltando para a página inicial");
    navigate("/");
  };

  const handleViewChange = (newView: AuthView) => {
    console.log("Mudando visualização para:", newView);
    setView(newView);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <AuthContainer>
        <button
          onClick={handleBack}
          className="absolute left-4 top-4 text-white hover:text-white/70 transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>

        {view === "login" && (
          <LoginForm 
            onBack={handleBack} 
            onViewChange={handleViewChange} 
            loading={loading} 
            setLoading={setLoading} 
          />
        )}
        
        {view === "register" && (
          <RegisterForm 
            onBack={handleBack} 
            onViewChange={handleViewChange} 
            loading={loading} 
            setLoading={setLoading} 
          />
        )}
        
        {view === "forgot-password" && (
          <ForgotPasswordForm 
            onBack={handleBack} 
            onViewChange={handleViewChange} 
            loading={loading} 
            setLoading={setLoading} 
          />
        )}
        
        {view === "reset-password" && (
          <ResetPasswordForm 
            onBack={handleBack} 
            onViewChange={handleViewChange} 
            loading={loading} 
            setLoading={setLoading} 
          />
        )}
      </AuthContainer>
    </div>
  );
}
