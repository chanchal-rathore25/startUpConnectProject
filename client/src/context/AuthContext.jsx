import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, signupUser, updateUserProfile, fetchMyProfile } from "../api/api1";

/**
 * AuthContext — StartupConnect (REAL BACKEND)
 * -------------------------------------------------
 * - login()/signup() backend ko call karte hain (services/api.js), jo
 *   MongoDB me user check/create karta hai aur JWT token deta hai.
 * - user + token dono localStorage me persist hote hain, taaki refresh
 *   pe login bana rahe.
 * - App load hote hi token se backend se fresh profile fetch karte hain,
 *   taaki data hamesha DB ke saath sync rahe.
 * - updateProfile() ab seedha backend PATCH /api/users/me ko call karta
 *   hai, phir response se local state update karta hai.
 * -------------------------------------------------
 */

const AuthContext = createContext(null);
const USER_KEY = "sc_auth_user";
const TOKEN_KEY = "sc_auth_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // App load hote hi saved token se backend se fresh profile le aate hain
  useEffect(() => {
    async function bootstrap() {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken) {
        setToken(storedToken);
        try {
          const { user: freshUser } = await fetchMyProfile(storedToken);
          setUser(freshUser);
          localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
        } catch {
          // Token expire/invalid ho gaya — logout kar do
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      } else if (storedUser) {
        localStorage.removeItem(USER_KEY);
      }
      setInitializing(false);
    }
    bootstrap();
  }, []);

  const persist = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    if (nextUser && nextToken) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  const login = async (email, password) => {
    const { user: loggedInUser, token: newToken } = await loginUser(email, password);
    persist(loggedInUser, newToken);
    return loggedInUser;
  };

  const signup = async (form) => {
    const { user: newUser, token: newToken } = await signupUser(form);
    persist(newUser, newToken);
    return newUser;
  };

  const logout = () => persist(null, null);

  // Developer/Founder/Investor profile pages isse call karte hain — ye seedha
  // backend PATCH /api/users/me ko hit karta hai, phir local state sync karta hai.
  const updateProfile = async (patch) => {
    const { user: updatedUser } = await updateUserProfile(patch, token);
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  };

  // Resume/pitch-deck upload ke baad backend jo updated user bhejta hai,
  // usse local state me set karne ke liye (DeveloperProfile/FounderProfile use karte hain)
  const setUserFromServer = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        initializing,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        setUserFromServer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}