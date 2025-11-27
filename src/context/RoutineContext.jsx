import { fetchUserRoutines } from "@/services/routineServices";
import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";

export const RoutineContext = createContext();

export const RoutineProvider = ({ children }) => {
  const [routineData, setRoutineData] = useState([]);

  useEffect(() => {
    const getUserRoutines = async () => {
      try {
        const data = await fetchUserRoutines();
        setRoutineData(data);
        console.log("User routines fetched:", data);
      } catch (error) {
        console.error("Failed to fetch user routines:", error);
      }
    };
    getUserRoutines();
  }, []);

  return (
    <RoutineContext.Provider value={{ routineData }}>
      {children}
    </RoutineContext.Provider>
  );
};
