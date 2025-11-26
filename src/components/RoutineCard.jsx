import React from "react";
import { BookOpen, Clock, MapPin, Users } from "lucide-react";

const RoutineCard = ({ data, onRoutineClick }) => {
  console.log(data);

  // Format time to display range
  const formatTimeRange = (startTime, endTime) => {
    const formatTime = (time) => {
      const [hours, minutes] = time.split(":");
      const hour12 = hours % 12 || 12;
      const ampm = hours >= 12 ? "PM" : "AM";
      return `${hour12}:${minutes} ${ampm}`;
    };
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  // Get class type and styling based on classType
  const getClassTypeStyling = () => {
    const classType = data.classType?.split(" ")[0]?.toLowerCase() || "lecture";

    switch (classType) {
      case "lecture":
        return {
          cardBg: "bg-indigo-50 dark:bg-indigo-900/20",
          accentColor: "bg-indigo-500",
          badgeColor: "bg-indigo-100 text-indigo-700",
          hoverBg: "group-hover:bg-indigo-200",
        };
      case "tutorial":
        return {
          cardBg: "bg-emerald-50 dark:bg-emerald-900/20",
          accentColor: "bg-emerald-500",
          badgeColor: "bg-emerald-100 text-emerald-700",
          hoverBg: "group-hover:bg-emerald-200",
        };
      case "workshop":
        return {
          cardBg: "bg-orange-50 dark:bg-orange-900/20",
          accentColor: "bg-orange-500",
          badgeColor: "bg-orange-100 text-orange-700",
          hoverBg: "group-hover:bg-orange-200",
        };
      default:
        return {
          cardBg: "bg-gray-50 dark:bg-gray-900/20",
          accentColor: "bg-gray-500",
          badgeColor: "bg-gray-100 text-gray-700",
          hoverBg: "group-hover:bg-gray-200",
        };
    }
  };

  const styling = getClassTypeStyling();
  const opacity = data.isActive ? "opacity-100" : "opacity-60";

  return (
    <div
      className="flex w-full font-manrope"
      onClick={() => onRoutineClick(data)}
    >
      <div
        className={`group relative my-3 flex min-h-[80px] w-full cursor-pointer items-center justify-between rounded-lg border border-t ${styling.cardBg} p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-700 sm:my-4 sm:min-h-[90px] sm:px-5 ${opacity}`}
      >
        <div
          className={`absolute left-0 top-0 h-full w-1 rounded-l-lg ${styling.accentColor}`}
        />

        <div
          className={`absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 ${styling.cardBg}`}
        />

        <div className="relative flex flex-1 items-start gap-3 sm:gap-4 md:gap-6">
          <div className="relative flex-shrink-0 after:absolute after:inset-0 after:rounded-full after:shadow-sm after:transition-shadow after:duration-300 group-hover:after:shadow-md">
            <img
              className="h-10 w-10 rounded-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12 md:h-14 md:w-14"
              src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-routine-psychology-flaticons-lineal-color-flat-icons-2.png"
              alt={`${data.moduleName} class`}
              loading="lazy"
            />
            {/* Status indicator based on isActive */}
            <div
              className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white shadow-sm sm:h-4 sm:w-4 ${styling.accentColor}`}
            />
          </div>

          <div className="sm:flex-between grid w-full gap-2 sm:gap-0">
            <div className="flex flex-1 flex-col gap-2.5">
              <h3 className="justify-between text-sm font-bold text-dark transition-colors dark:text-gray-100 sm:flex sm:text-base">
                <p className="group-hover:text-accent">{data.moduleName}</p>
                <div className="flex items-center gap-1 transition-transform duration-300 hover:scale-105 sm:gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-accent sm:h-4 sm:w-4" />
                  <span className="text-sm text-gray-500">
                    {formatTimeRange(data.startTime, data.endTime)}
                  </span>
                </div>
              </h3>

              <div className="mb-1.5 mt-1 flex flex-wrap gap-2">
                <div
                  className={`flex items-center justify-self-start rounded-full px-4 py-1 text-xs font-medium shadow-sm transition-all duration-300 ${styling.badgeColor} ${styling.hoverBg}`}
                >
                  {data.classType}
                </div>
                <div className="flex items-center justify-self-start rounded-full bg-gray-100 px-4 py-1 text-xs font-medium text-gray-700 shadow-sm transition-all duration-300 group-hover:bg-gray-200">
                  {data.moduleCode}
                </div>
                {!data.isActive && (
                  <div className="flex items-center justify-self-start rounded-full bg-red-100 px-4 py-1 text-xs font-medium text-red-700 shadow-sm">
                    Inactive
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-dark/70 dark:text-gray-400 sm:gap-4 sm:text-sm">
                <div className="flex items-center gap-1 transition-transform duration-300 hover:scale-105 sm:gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue sm:h-4 sm:w-4" />
                  <span className="text-sm">{data.room}</span>
                </div>
                <div className="flex items-center gap-1 transition-transform duration-300 hover:scale-105 sm:gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-accent sm:h-4 sm:w-4" />
                  <span className="text-sm">{data.teacher.name}</span>
                </div>
                {data.joinedGroups && data.joinedGroups.length > 0 && (
                  <div className="flex items-center gap-1 transition-transform duration-300 hover:scale-105 sm:gap-1.5">
                    <Users className="h-3.5 w-3.5 text-purple-500 sm:h-4 sm:w-4" />
                    <span className="text-sm">
                      {data.joinedGroups.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineCard;
