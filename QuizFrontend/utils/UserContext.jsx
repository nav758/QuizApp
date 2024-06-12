import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [quizId, setQuizId] = useState("");
  

  return (
    <UserContext.Provider value={{ quizId, setQuizId}}>
      {children}
    </UserContext.Provider>
  );
};

