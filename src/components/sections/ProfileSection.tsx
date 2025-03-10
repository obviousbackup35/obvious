
import { ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { UserInfo } from "@/components/profile/UserInfo";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { LogoutButton } from "@/components/profile/LogoutButton";

interface ProfileSectionProps {
  isVisible: boolean;
  onBack: () => void;
}

export const ProfileSection = ({ isVisible, onBack }: ProfileSectionProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
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
            <>
              {!showPasswordChange ? (
                <UserInfo 
                  user={user} 
                  onPasswordChangeClick={() => setShowPasswordChange(true)} 
                />
              ) : (
                <PasswordChangeForm 
                  onCancel={() => setShowPasswordChange(false)} 
                />
              )}
            </>
          )}
          
          <LogoutButton onLogoutSuccess={onBack} />
        </div>
      </div>
    </div>
  );
};
