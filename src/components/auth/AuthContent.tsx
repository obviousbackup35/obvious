
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { AuthView } from "./types";

interface AuthContentProps {
  onBack: () => void;
}

export const AuthContent = ({ onBack }: AuthContentProps) => {
  const [loading, setLoading] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");
  const location = useLocation();

  // Check for password reset parameters in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    
    if (type === "recovery") {
      setAuthView("reset-password");
    }
  }, [location]);

  const handleViewChange = (view: AuthView) => {
    setAuthView(view);
  };

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md mx-4 text-white relative">
        <button
          onClick={onBack}
          className="absolute left-4 top-4 text-white/60 hover:text-white transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>

        {authView === "login" && (
          <LoginForm 
            onBack={onBack} 
            onViewChange={handleViewChange} 
            loading={loading} 
            setLoading={setLoading} 
          />
        )}
        
        {authView === "register" && (
          <RegisterForm 
            onBack={onBack} 
            onViewChange={handleViewChange} 
            loading={loading} 
            setLoading={setLoading} 
          />
        )}
        
        {authView === "forgot-password" && (
          <ForgotPasswordForm 
            onBack={onBack} 
            onViewChange={handleViewChange} 
            loading={loading} 
            setLoading={setLoading} 
          />
        )}
        
        {authView === "reset-password" && (
          <ResetPasswordForm 
            onBack={onBack} 
            onViewChange={handleViewChange} 
            loading={loading} 
            setLoading={setLoading} 
          />
        )}
      </div>
    </div>
  );
};
