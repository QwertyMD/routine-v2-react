import React from "react";
import RoutineData from "../../class-routine.json";
import { getTodayDay } from "@/lib/utils";
import Onboarding from "@/components/Onboarding";
import DateButton from "@/components/DateButton";
import RoutineCard from "@/components/RoutineCard";
import EventCard from "@/components/EventCard";
import Assignment from "@/components/Assignment";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useUserGroup } from "@/context/UserGroupContext.jsx";
import ClassDetailModal from "@/components/ClassDetailModal";
import { useRoutines } from "@/hooks/useRoutines";
import { useEffect } from "react";

const markedDates = [
  new Date(2025, 1, 23),
  new Date(2025, 2, 15),
  new Date(2025, 2, 20),
];
const Home = () => {
  const { routineData } = useRoutines();
  const [modalVisibile, setModalVisibile] = React.useState(false);
  const [selectedRoutine, setselectedRoutine] = React.useState(null);

  // const { userGroup } = useUserGroup();
  const [todayRoutine, setTodayRoutine] = React.useState([]);
  const [selectedDay, setSelectedDay] = React.useState();

  // React.useEffect(() => {

  // }, [userGroup]);

  const handleSelect = (day) => {
    setSelectedDay(day);
    setTodayRoutine(handleFilterRoutine(day));
  };

  const handleFilterRoutine = (day) => {
    if (!routineData.week) return [];
    const filteredRoutine = routineData.week.filter(
      (routine) => routine.day?.toLowerCase() === day?.toLowerCase(),
    );
    console.log("Filtered Routine:", filteredRoutine);
    return filteredRoutine.flatMap((routine) => routine.slots || []);
  };

  const handleRoutineClick = (routine) => {
    setselectedRoutine(routine);
    setModalVisibile(true);
  };

  useEffect(() => {
    if (!routineData) return;
    const dayName = getTodayDay();
    console.log("Routine Data :", dayName);
    handleSelect(dayName);
    // setUserGroup(groupNumber);
    setTodayRoutine(handleFilterRoutine(dayName));
  }, [routineData]);

  return (
    <>
      {modalVisibile && (
        <div className="fixed inset-0 z-[999] h-full w-full bg-black/20">
          <ClassDetailModal
            data={selectedRoutine}
            onModalClose={() => setModalVisibile(false)}
          />
        </div>
      )}
      <p className="px-4 font-poppins text-2xl font-semibold">
        Upcoming Events
      </p>
      <div className="px-4 pb-20 md:pb-4 lg:flex lg:gap-6 justify-between">
        <div className="">
          <div className="event-card w-full">
            <EventCard />
          </div>
          <div>
            <DateButton selectedDay={selectedDay} handleSelect={handleSelect} />
            {todayRoutine.length > 0 ? (
              todayRoutine.map((routine, index) => (
                <RoutineCard
                  key={index}
                  data={routine}
                  onRoutineClick={handleRoutineClick}
                />
              ))
            ) : (
              <img
                className="max-h-[31.25rem] w-full rounded-2xl shadow-[0_2px_8px_rgba(0,_0,_0,_0.1)] hover:shadow-[0_4px_16px_rgba(0,_0,_0,_0.1)]"
                src="https://cdn.create.vista.com/api/media/small/320442286/stock-photo-404-error-page-not-found-shocked-man-looks-at-the-error-message-isolated"
                alt=""
              />
            )}
          </div>
        </div>
        <div className="gap-20 lg:w-1/3 lg:gap-10">
          <div className="my-5 h-fit w-full rounded-xl bg-white px-6 py-4 shadow-[0_2px_8px_rgba(0,_0,_0,_0.1)] hover:shadow-[0_4px_16px_rgba(0,_0,_0,_0.1)] dark:border-dark-border dark:bg-dark-card">
            <DayPicker
              className="justify-items-center py-10 font-manrope lg:scale-105"
              mode="single"
              selected={null}
              modifiers={{ marked: markedDates }}
              modifiersStyles={{
                marked: {
                  backgroundColor: "#ffeb3b",
                  borderRadius: "50%",
                  color: "#000",
                },
              }}
            />
          </div>
          <div className="assignment-container h-fit w-full rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,_0,_0,_0.1)] hover:shadow-[0_4px_16px_rgba(0,_0,_0,_0.1)] dark:border-dark-border dark:bg-dark-card">
            <Assignment />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
