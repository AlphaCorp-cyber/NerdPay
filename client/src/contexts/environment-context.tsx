import { createContext, useContext, useState, ReactNode } from "react";

type Environment = "sandbox" | "live";

interface EnvironmentContextType {
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  isLive: boolean;
  isSandbox: boolean;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironment] = useState<Environment>("sandbox");

  const value = {
    environment,
    setEnvironment,
    isLive: environment === "live",
    isSandbox: environment === "sandbox",
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error("useEnvironment must be used within an EnvironmentProvider");
  }
  return context;
}