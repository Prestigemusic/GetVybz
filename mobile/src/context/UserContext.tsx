// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "customer" | "pro";

interface UserContextType {
  name: string;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType>({
  name: "Daniel",
  role: "customer",
  setRole: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>("customer");
  const name = "Daniel"; // replace with auth info later

  return (
    <UserContext.Provider value={{ name, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
