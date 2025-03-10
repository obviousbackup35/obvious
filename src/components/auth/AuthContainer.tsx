
import { ReactNode } from "react";

interface AuthContainerProps {
  children: ReactNode;
}

export const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md mx-4 text-white relative">
        {children}
      </div>
    </div>
  );
};
