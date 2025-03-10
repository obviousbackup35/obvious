
export type AuthView = "login" | "register" | "forgot-password" | "reset-password";

export interface AuthFormProps {
  onBack: () => void;
  onViewChange: (view: AuthView) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
