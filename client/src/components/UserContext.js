import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Initialize user data from localStorage or empty strings
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );

  const [csrfToken, setCsrfToken] = useState(
    localStorage.getItem("csrfToken") || ""
  );

  const [isLogged, setIsLogged] = useState(
    localStorage.getItem("isLogged") || false
  );

  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

  const [TeamDetailsOpen, setTeamDetailsOpen] = useState(false);
  const [TeamId, setTeamId] = useState("");

  // Save user data to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userName", userName);
      localStorage.setItem("csrfToken", csrfToken);
      localStorage.setItem("isLogged", isLogged);
      localStorage.setItem("userId", userId);
    } catch (error) {
      console.error("Error saving user data to localStorage:", error);
    }
  }, [userEmail, userName, csrfToken, isLogged, userId]);

  return (
    <UserContext.Provider
      value={{
        userEmail,
        setUserEmail,
        userName,
        setUserName,
        csrfToken,
        setCsrfToken,
        isLogged,
        setIsLogged,
        userId,
        setUserId,
        TeamDetailsOpen,
        setTeamDetailsOpen,
        TeamId,
        setTeamId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
