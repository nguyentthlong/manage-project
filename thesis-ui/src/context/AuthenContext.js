import jwtDecode from "jwt-decode";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthenContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
  login: () => {},
  user: null,
});

export const getSession = () => {
  console.log("get accessToken");
  console.log(localStorage.getItem("accessToken"));
  let x = localStorage.getItem("accessToken");
  if (x) return x;
  else return null;
};

export const setSessionInLocalStorage = (token) => {
  localStorage.setItem("session", JSON.stringify(token));
  return true;
};

const CheckToken = (token) => {
  let decodeken = jwtDecode(token);
  //console.log("Decoded Token", decodeken);
  let currentDate = new Date();

  // JWT exp is in seconds
  if (decodeken.exp * 1000 < currentDate.getTime()) {
    console.log("Token expired.");
    return true;
  }
};

export function AuthenProvider({ children }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      const token = getSession();
      if (CheckToken(token)) {
        console.log(token);
        setAuthenticated(false);
        setLoading(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      } else {
        setAuthenticated(true);
        setLoading(false);
        setUser(JSON.parse(localStorage.getItem("user")));
      }
    } else {
      setAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const login = (token, user) => {
    setAuthenticated(true);
    setLoading(false);
    setUser(user);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setAuthenticated(false);
    setUser(null);
    setLoading(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthenContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        user,
      }}
    >
      {children}
    </AuthenContext.Provider>
  );
}
