
import { Button } from "@/components/ui/button";
import { Key, Mail, UserCircle } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface UserInfoProps {
  user: User | null;
  onPasswordChangeClick: () => void;
}

export const UserInfo = ({ user, onPasswordChangeClick }: UserInfoProps) => {
  if (!user) return null;
  
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-3 text-white/90 text-lg mb-2">
        <UserCircle size={24} />
        <p className="text-white font-medium">Conta</p>
      </div>
      
      <div className="flex items-center gap-3 text-white/90 text-lg mb-4">
        <Mail size={20} />
        <p className="text-white font-medium">{user.email}</p>
      </div>
      
      <Button 
        variant="outline" 
        onClick={onPasswordChangeClick}
        className="w-full bg-white/10 text-white hover:bg-white/20 border-white/30"
      >
        <Key className="mr-2 h-5 w-5" />
        Alterar senha
      </Button>
    </div>
  );
};
