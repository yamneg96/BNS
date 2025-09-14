import { createContext, useContext, useEffect, useState } from 'react';
import {
  login as loginService,
  register as registerService,
  getProfile as getProfileService,
  verifyOtp,
  resendOtp,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
} from "../services/auth";
import { initiatePayment } from '../services/payment';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState();

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const profile = await getProfileService(token);
          setUser(profile);
          setUserEmail(profile.email);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setToken(null);
          sessionStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const { token, ...userData } = await loginService(email, password);
    setToken(token);
    sessionStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    sessionStorage.removeItem("token");
    setUser(null);
  };

  const register = async (name, email, password, role, plan) => {
    const regData = await registerService(name, email, password, role, plan);
    setUserEmail(email);//Later to register email.
    return regData;
  };

  const checkOtp = async (email, otp) => {
    await verifyOtp(email, otp);
  };

  const resendVerificationOtp = async (email) => {
    await resendOtp(email);
  };

  // New function for handling the forgot password flow
  const forgotPassword = async (email) => {
    const res = await forgotPasswordService(email);
    setUserEmail(res.email)// Later to reset email.
    return res;
  };

  // New function for handling the reset password flow
  const resetPassword = async (email, otp, newPassword) => {
    await resetPasswordService(email, otp, newPassword);
  };

  //Subscription
  const initiateUserPayment = async (email) => {
  const response = await initiatePayment(email);
  if (response.checkout_url) {
    window.location.href = response.checkout_url; // redirect user to Chapa
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        userEmail,
        token,
        loading,
        login,
        logout,
        register,
        checkOtp,
        resendVerificationOtp,
        forgotPassword,
        resetPassword,
        initiateUserPayment, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;