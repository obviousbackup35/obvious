
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
        className="absolute left-8 top-16 text-white hover:opacity-70 transition-opacity p-3"
        aria-label="Voltar para dunas"
      >
        <ChevronLeft size={40} />
      </button>
      <div className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12">
          <div className="lg:col-start-5 text-center">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-0 mix-blend-color-burn font-semibold bg-[#c8c5ad] hover:bg-[#c8c5ad]/90 px-8 text-lg"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
