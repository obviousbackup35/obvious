
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { AuthView } from "./types";
import { BackButton } from "./BackButton";
import { AuthContainer } from "./AuthContainer";

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
    <AuthContainer>
      <BackButton onClick={onBack} />

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
    </AuthContainer>
  );
};
