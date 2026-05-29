import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Ensure refresh token HTTP-only cookie is stored/sent
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid username or password");
      }

      const data = await response.json();
      if (!data.accessToken) {
        throw new Error("No access token returned from system");
      }

      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);
      return true;
    } catch (err) {
      setError(err.message || "Unable to connect. Please try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, loading, error, setError, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
