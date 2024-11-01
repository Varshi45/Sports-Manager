import React, { createContext, useState, useContext, useEffect } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [sports, setSports] = useState(() => {
    const savedSports = localStorage.getItem("sports");
    return savedSports ? JSON.parse(savedSports) : [];
  });

  const [matches, setMatches] = useState(() => {
    const savedMatches = localStorage.getItem("matches");
    return savedMatches ? JSON.parse(savedMatches) : [];
  });

  // Store user, sports, and matches in localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("sports", JSON.stringify(sports));
  }, [sports]);

  useEffect(() => {
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [matches]);

  return (
    <GlobalContext.Provider
      value={{ user, setUser, sports, setSports, matches, setMatches }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
