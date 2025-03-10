
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="absolute left-4 top-4 text-white/60 hover:text-white transition-colors"
      aria-label="Voltar"
    >
      <ArrowLeft size={24} />
    </button>
  );
};
