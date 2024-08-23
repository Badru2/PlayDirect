import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);

  const login = async (data) => {
    setUser(data);

    switch (data.role) {
      case "superAdmin":
        window.location.href = "/superAdmin/dashboard";
        break;
      case "admin":
        window.location.href = "/admin/dashboard";
        break;
      case "user":
        window.location.href = "/";
        break;
      default:
        console.error("Unknown role:", data.role);
        break;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Clear the token from local storage
    window.location.href = "/login";
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
