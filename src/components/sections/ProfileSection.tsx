
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ChevronLeft } from "lucide-react";

interface ProfileSectionProps {
  isVisible: boolean;
  onBack: () => void;
}

export const ProfileSection = ({ isVisible, onBack }: ProfileSectionProps) => {
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
      <button 
        onClick={onBack}
        className="absolute left-4 top-16 text-white hover:opacity-70 transition-opacity p-3"
        aria-label="Voltar para dunas"
      >
        <ChevronLeft size={40} />
      </button>
      <div className="absolute bottom-8 right-8">
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="bg-white text-black hover:bg-white/90 px-8 text-lg font-semibold"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
