
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sessionInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  sessionInitialized: false 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle password reset redirects
  useEffect(() => {
    const handlePasswordReset = async () => {
      const searchParams = new URLSearchParams(location.search);
      const type = searchParams.get("type");
      
      if (type === "recovery") {
        const accessToken = searchParams.get("access_token");
        
        if (accessToken) {
          try {
            // Set the access token in the session
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: "",
            });
            
            if (error) throw error;
            
            // Notify user to set new password
            toast({
              title: "Password reset",
              description: "Please set your new password now.",
            });
            
            // Navigate to reset password form
            navigate("/auth?type=recovery", { replace: true });
          } catch (err: any) {
            console.error("Error processing password reset:", err);
            toast({
              title: "Reset error",
              description: err.message || "Invalid or expired reset link",
              variant: "destructive",
            });
          }
        }
      }
    };

    if (location.search) {
      handlePasswordReset();
    }
  }, [location, navigate]);

  useEffect(() => {
    // Check if there's an active session
    const initSession = async () => {
      try {
        console.log("Fetching auth session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          toast({
            title: "Authentication error",
            description: "Failed to retrieve session",
            variant: "destructive",
          });
        } else {
          console.log("Session data:", data.session ? "Session exists" : "No active session");
          setUser(data.session?.user ?? null);
        }
      } catch (err) {
        console.error("Unexpected error during session retrieval:", err);
      } finally {
        setLoading(false);
        setSessionInitialized(true);
      }
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session ? "Session exists" : "No session");
      setUser(session?.user ?? null);
      setLoading(false);
      setSessionInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, sessionInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
