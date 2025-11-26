import React from "react";

const DateButton = ({ handleSelect, selectedDay }) => {
  const currentDate = new Date();
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI"];
  const currentDayIndex = currentDate.getDay();
  const datesOfWeek = Array.from({ length: 7 }, (_, index) => {
    const dayOffset = index - currentDayIndex;
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + dayOffset);
    return date.getDate();
  });

  return (
    <div className="date-buttons my-4 flex flex-wrap justify-center lg:justify-between gap-4 rounded-lg py-4 font-manrope dark:border-dark-border dark:bg-dark-card md:mb-4 lg:my-0">
      {daysOfWeek.map((day, index) => {
        const isSelected = selectedDay === day;

        return (
          <button
            key={index}
            onClick={() => handleSelect(day)}
            className={`flex w-16 flex-col items-center rounded-2xl px-3 py-2 text-xs shadow-[0_2px_8px_rgba(0,_0,_0,_0.1)] hover:shadow-[0_4px_16px_rgba(0,_0,_0,_0.1)] transition-all duration-200 sm:w-28 lg:px-9 lg:py-3 ${
              isSelected
                ? "scale-105 bg-[#ec4899] text-white hover:shadow-[0_4px_16px_rgba(236,_72,_153,_0.3)]"
                : "bg-white dark:bg-gray-900"
            } hover:scale-105 ${!isSelected && "hover:bg-gray-50 dark:hover:bg-gray-800 border-2"}`}
          >
            <span className="text-xs font-medium sm:text-sm">{day}</span>
            <span className="mb-1 text-base font-bold sm:text-xl">
              {datesOfWeek[index]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DateButton;
