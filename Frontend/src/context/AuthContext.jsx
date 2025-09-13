import { createContext, useContext, useEffect, useState } from 'react';
import {
  login as loginService,
  register as registerService,
  getProfile as getProfileService,
  verifyOtp,
  resendOtp,
} from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const profile = await getProfileService(token);
          console.log(profile);
          setUser(profile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setToken(null);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const { token, ...userData } = await loginService(email, password);
    setToken(token);
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  const register = async (name, email, password, role) => {
    const regData =  await registerService(name, email, password, role);
    console.log(regData);
    return regData;
  };

  const checkOtp = async (email, otp) => {
    await verifyOtp(email, otp);
  };

  const resendVerificationOtp = async (email) => {
    await resendOtp(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        checkOtp,
        resendVerificationOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;