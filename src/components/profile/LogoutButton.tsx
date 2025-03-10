
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface LogoutButtonProps {
  onLogoutSuccess: () => void;
}

export const LogoutButton = ({ onLogoutSuccess }: LogoutButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Logout successful",
        description: "You've been signed out",
      });
      onLogoutSuccess();
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      disabled={loading}
      className="w-full bg-white text-black hover:bg-white/90 px-8 text-lg font-semibold h-12"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span>Signing out...</span>
        </>
      ) : (
        "Sign out"
      )}
    </Button>
  );
};
