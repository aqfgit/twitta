import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

const Timeline = () => {
  const { currentUser } = useAuth();
  const [handle, setHandle] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const data = await db.collection("users").get();
      data.forEach((doc) => {
        if (doc.data().email == currentUser.email) {
          setHandle(doc.data().handle);
        }
      });
    };
    fetchData();
  }, [currentUser.email, setHandle]);

  return (
    <>
      <div>Welcome, {handle}</div>
      <Link to="/dashboard">Dashboard</Link>
    </>
  );
};

export default Timeline;
