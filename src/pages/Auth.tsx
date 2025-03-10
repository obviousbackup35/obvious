
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { toast } from "@/components/ui/use-toast";
import { AuthView } from "@/components/auth/types";
import { ArrowLeft } from "lucide-react";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<AuthView>("login");
  const navigate = useNavigate();
  const { user, sessionInitialized } = useAuth();

  // Check for password reset parameters in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get("type");
    
    if (type === "recovery") {
      setView("reset-password");
    }
  }, []);

  // Redirect to home if already authenticated
  useEffect(() => {
    if (sessionInitialized && user) {
      navigate("/");
    }
  }, [user, sessionInitialized, navigate]);

  const handleBack = () => {
    navigate("/");
  };

  const handleViewChange = (newView: AuthView) => {
    setView(newView);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={handleBack}
          className="absolute left-4 top-4 text-white hover:text-white/70 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          {view === "login" && "Sign In"}
          {view === "register" && "Create Account"}
          {view === "forgot-password" && "Reset Password"}
          {view === "reset-password" && "Create New Password"}
        </h1>

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
      </div>
    </div>
  );
}
