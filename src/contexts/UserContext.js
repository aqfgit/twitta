import React, { useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
const UserContext = React.createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentUserHandle, setCurrentUserHandle] = useState("");
  const [currentDbUserId, setCurrentDbUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await db
        .collection("users")
        .where("email", "==", currentUser.email)
        .get();
      data.forEach((doc) => {
        setCurrentUserHandle(doc.data().handle);
        setCurrentDbUserId(doc.id);
      });
      setLoading(false);
    };

    fetchUser();
  }, []);

  useEffect(() => {}, []);

  const value = {
    currentUserHandle,
    currentDbUserId,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};
