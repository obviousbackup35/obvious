
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface ProfileSectionProps {
  isVisible: boolean;
  onBack: () => void;
}

export const ProfileSection = ({ isVisible, onBack }: ProfileSectionProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
      });
      onBack();
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive",
      });
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
      <div className="flex flex-col items-center justify-center h-full">
        <Button 
          variant="outline"
          onClick={handleLogout}
          className="bg-white/20 hover:bg-white/30 text-white"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
