import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({ children }) => {
  // Initialize state for logged in user and farmer
  const [loggedin, setLoggedin] = useState(() => {
    return JSON.parse(localStorage.getItem("loggedin")) || false;
  });
  
  const [isUser, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("isUser")) || false;
  });

  const [isFarmer, setFarmer] = useState(() => {
    return JSON.parse(localStorage.getItem("isFarmer")) || false;
  });

  // Update localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("loggedin", JSON.stringify(loggedin));
  }, [loggedin]);

  useEffect(() => {
    localStorage.setItem("isUser", JSON.stringify(isUser));
  }, [isUser]);

  useEffect(() => {
    localStorage.setItem("isFarmer", JSON.stringify(isFarmer));
  }, [isFarmer]);

  return (
    <UserContext.Provider
      value={{
        loggedin,
        setLoggedin,
        isUser,
        setUser,
        isFarmer,
        setFarmer,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
