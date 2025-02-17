
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

type AuthView = "login" | "register" | "forgot-password";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<AuthView>("login");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate("/");
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
      setView("login");
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
        redirectTo: `${window.location.origin}/auth?view=reset-password`,
      });

      if (error) throw error;
      toast({
        title: "Email Sent",
        description: "Check your email to reset your password.",
      });
      setView("login");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-bold text-center mb-6">
          {view === "login" && "Sign In"}
          {view === "register" && "Create Account"}
          {view === "forgot-password" && "Reset Password"}
        </h1>

        <form onSubmit={
          view === "login" 
            ? handleLogin 
            : view === "register" 
              ? handleRegister 
              : handleForgotPassword
        }>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {view !== "forgot-password" && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Loading..." : (
                view === "login" 
                  ? "Sign In" 
                  : view === "register" 
                    ? "Sign Up" 
                    : "Send Email"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center space-y-2">
          {view === "login" && (
            <>
              <button
                onClick={() => setView("forgot-password")}
                className="text-sm text-blue-600 hover:underline block w-full"
              >
                Forgot your password?
              </button>
              <button
                onClick={() => setView("register")}
                className="text-sm text-blue-600 hover:underline block w-full"
              >
                Don't have an account? Sign Up
              </button>
            </>
          )}
          {(view === "register" || view === "forgot-password") && (
            <button
              onClick={() => setView("login")}
              className="text-sm text-blue-600 hover:underline block w-full"
            >
              Already have an account? Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
