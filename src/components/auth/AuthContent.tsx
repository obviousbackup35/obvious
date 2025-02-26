
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

type AuthView = "login" | "register" | "forgot-password";

interface AuthContentProps {
  onBack: () => void;
}

export const AuthContent = ({ onBack }: AuthContentProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      onBack();
    } catch (error: any) {
      toast({
        title: "Login Error",
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
        title: "Registration Successful",
        description: "Please check your email to confirm your registration.",
      });
      setAuthView("login");
    } catch (error: any) {
      toast({
        title: "Registration Error",
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
        title: "Email Sent",
        description: "Check your email to reset your password.",
      });
      setAuthView("login");
    } catch (error: any) {
      toast({
        title: "Email Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-xl w-full max-w-md text-white relative">
        <button
          onClick={onBack}
          className="absolute left-4 top-4 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-bold text-center mb-6">
          {authView === "login" && "Sign In"}
          {authView === "register" && "Create Account"}
          {authView === "forgot-password" && "Reset Password"}
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
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
              />
            </div>

            {authView !== "forgot-password" && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
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
              {loading ? "Loading..." : (
                authView === "login" 
                  ? "Sign In" 
                  : authView === "register" 
                    ? "Sign Up" 
                    : "Send Email"
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
                Forgot your password?
              </button>
              <button
                onClick={() => setAuthView("register")}
                className="text-sm text-white/80 hover:text-white block w-full"
              >
                Don't have an account? Sign Up
              </button>
            </>
          )}
          {(authView === "register" || authView === "forgot-password") && (
            <button
              onClick={() => setAuthView("login")}
              className="text-sm text-white/80 hover:text-white block w-full"
            >
              Already have an account? Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
