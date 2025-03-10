
import { ReactNode } from "react";

interface AuthContainerProps {
  children: ReactNode;
}

export const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-xl w-full max-w-md relative">
      {children}
    </div>
  );
};
