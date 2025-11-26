import { RoutineContext } from "@/context/RoutineContext";
import { useContext } from "react";

export const useRoutines = () => useContext(RoutineContext);
