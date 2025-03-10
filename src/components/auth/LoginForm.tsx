
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AuthFormProps } from "./types";

export const LoginForm = ({ onBack, onViewChange, loading, setLoading }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Required fields",
        description: "Please enter email and password to continue",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log("Attempting login with:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("Login successful:", data.user?.id);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // The redirect will happen automatically via the useEffect in the Auth page
    } catch (error: any) {
      console.error("Login error:", error.message);
      toast({
        title: "Login error",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
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
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/20 border-white/30 text-white"
              autoComplete="current-password"
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
                <span>Processing...</span>
              </>
            ) : "Sign In"}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center space-y-2">
        <button
          onClick={() => onViewChange("forgot-password")}
          className="text-sm text-white/80 hover:text-white block w-full"
        >
          Forgot your password?
        </button>
        <button
          onClick={() => onViewChange("register")}
          className="text-sm text-white/80 hover:text-white block w-full"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </>
  );
};
