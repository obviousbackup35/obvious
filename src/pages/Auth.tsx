
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

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
      setView("login");
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
        redirectTo: `${window.location.origin}/auth?view=reset-password`,
      });

      if (error) throw error;
      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir sua senha.",
      });
      setView("login");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {view === "login" && "Login"}
          {view === "register" && "Criar Conta"}
          {view === "forgot-password" && "Recuperar Senha"}
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
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {view !== "forgot-password" && (
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
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
              {loading ? "Carregando..." : (
                view === "login" 
                  ? "Entrar" 
                  : view === "register" 
                    ? "Registrar" 
                    : "Enviar Email"
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
                Esqueceu sua senha?
              </button>
              <button
                onClick={() => setView("register")}
                className="text-sm text-blue-600 hover:underline block w-full"
              >
                Não tem uma conta? Registre-se
              </button>
            </>
          )}
          {(view === "register" || view === "forgot-password") && (
            <button
              onClick={() => setView("login")}
              className="text-sm text-blue-600 hover:underline block w-full"
            >
              Já tem uma conta? Faça login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
