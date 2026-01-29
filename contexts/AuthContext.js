import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cinemaApi from "../cinemaApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const storedUser = await AsyncStorage.getItem("currentUser");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser)); // Parse the string back into an object
      }
    };

    loadCurrentUser();
  }, []);

  const signUp = async (userData) => {
    try {
      const response = await cinemaApi.post(
        "/auth/signup",
        JSON.stringify(userData),
        { headers: { "Content-Type": "application/json" } }
      );
      const data = response.data;

      if (data) {
        await AsyncStorage.setItem("currentUser", JSON.stringify(data)); // Convert object to string
        setCurrentUser(data);
      }
    } catch (error) {
      console.error("Sign Up Error:", error);
    }
  };

  const signIn = async (userData) => {
    try {
      const response = await cinemaApi.post(
        "/auth/login",
        JSON.stringify(userData),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;
      if (data) {
        await AsyncStorage.setItem("currentUser", JSON.stringify(data)); // Convert object to string
        setCurrentUser(data);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Sign In Error:", error);
      return false;
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
