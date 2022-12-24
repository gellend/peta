import { createContext, useContext, useState } from "react";

export const UserContext = createContext();

export default function UserContextComp({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  return (
    <UserContext.Provider
      value={{ user, setUser, loadingUser, setLoadingUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
