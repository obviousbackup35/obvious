
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PasswordChangeFormProps {
  onCancel: () => void;
}

export const PasswordChangeForm = ({ onCancel }: PasswordChangeFormProps) => {
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: "Required fields",
        description: "Please fill in both password fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "The passwords you entered are different",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setPasswordLoading(true);
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      setPassword("");
      setConfirmPassword("");
      onCancel();
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <form onSubmit={handlePasswordChange} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">New password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white/20 border-white/30 text-white"
          autoComplete="new-password"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="bg-white/20 border-white/30 text-white"
          autoComplete="new-password"
        />
      </div>
      
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          className="flex-1 bg-white/10 text-white hover:bg-white/20 border-white/30"
        >
          Cancel
        </Button>
        
        <Button 
          type="submit" 
          className="flex-1 bg-white text-black hover:bg-white/90"
          disabled={passwordLoading}
        >
          {passwordLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </form>
  );
};
