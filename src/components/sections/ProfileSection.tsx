
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

interface ProfileSectionProps {
  isVisible: boolean;
  onBack: () => void;
}

export const ProfileSection = ({ isVisible, onBack }: ProfileSectionProps) => {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
      onBack();
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="absolute inset-0 w-full h-full bg-black"
      style={{ 
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <button 
        onClick={onBack}
        className="absolute left-8 top-36 text-white hover:opacity-70 transition-opacity p-3"
        aria-label="Voltar"
      >
        <ChevronLeft size={40} />
      </button>

      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Perfil</h2>
          
          {user && (
            <div className="mb-6">
              <p className="text-white/90 text-lg mb-2">Email:</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-white/90 px-8 text-lg font-semibold h-12"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Saindo...</span>
              </>
            ) : (
              "Sair da conta"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
