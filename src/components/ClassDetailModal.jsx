import React, { useState, useEffect } from "react";
import {
  AlarmClock,
  ClipboardList,
  Github,
  Linkedin,
  Mail,
  NotebookPen,
  X,
  Clock,
  MapPin,
  BookOpen,
  Users,
  Calendar,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ClassDetailModal = ({ data, onModalClose }) => {
  const [rotateFront, setrotateFront] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setrotateFront((prev) => !prev);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative max-h-[88vh] w-full max-w-xl cursor-default overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
        >
          {/* Header with gradient background */}
          <div className="relative rounded-t-2xl bg-gradient-to-r from-[#f84178] to-[#ff6b9d] p-6">
            <button
              className="absolute right-3 top-3 rounded-full bg-white/20 p-1.5 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30 active:scale-95"
              onClick={() => onModalClose()}
            >
              <X className="h-4 w-4 text-white" />
            </button>

            <div className="pr-8 text-center text-white">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                <Calendar className="h-3 w-3" />
                <span className="text-xs font-medium">
                  {data.classType} Session
                </span>
              </div>
              <h1 className="mb-2 text-xl font-bold leading-tight">
                {data.moduleName}
              </h1>
              <div className="flex items-center justify-center gap-4 text-sm text-white/90">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">
                    {data.startTime} - {data.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  <span className="font-medium">{data.room}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-7 p-7">
              {/* Class Details Section */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-[#f84178]/10 to-[#ff6b9d]/10 p-2.5">
                    <ClipboardList className="h-5 w-5 text-[#f84178]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Class Information
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DataCard
                    icon={<BookOpen className="h-4 w-4 text-[#f84178]" />}
                    title="Module Code"
                    value={data.moduleCode}
                  />
                  <DataCard
                    icon={<Award className="text-blue-500 h-4 w-4" />}
                    title="Class Type"
                    value={data.classType}
                  />
                  <DataCard
                    icon={<Users className="h-4 w-4 text-green-500" />}
                    title="Group"
                    value="L5CG1"
                  />
                  <DataCard
                    icon={<MapPin className="h-4 w-4 text-purple-500" />}
                    title="Location"
                    value={data.room}
                  />
                </div>
              </div>
              {/* Lecturer Information Section */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="from-blue-500/10 rounded-lg bg-gradient-to-br to-purple-500/10 p-2.5">
                    <NotebookPen className="text-blue-600 h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Instructor
                  </h2>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-5">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="relative">
                      <img
                        src="https://wallpapers.com/images/high/confused-patrick-random-pfp-x63wp9vs43cem64s.webp"
                        className="border-3 h-16 w-16 rounded-full border-white object-cover shadow-md"
                        alt="Instructor"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-green-500 p-0.5">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {data.teacher.name}
                      </h3>
                      <p className="font-medium text-gray-600">
                        Senior Lecturer
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <a
                        // href=""
                        href={`mailto:${data.teacher.email}`}
                        className="group rounded-lg bg-gradient-to-r from-red-500 to-red-600 p-2.5 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                      >
                        <Mail className="h-4 w-4 text-white transition-transform group-hover:rotate-12" />
                      </a>
                      <a
                        href=""
                        className="from-blue-600 to-blue-700 group rounded-lg bg-gradient-to-r p-2.5 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                      >
                        <Linkedin className="h-4 w-4 text-white transition-transform group-hover:rotate-12" />
                      </a>
                      <a
                        href=""
                        className="group rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 p-2.5 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                      >
                        <Github className="h-4 w-4 text-white transition-transform group-hover:rotate-12" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ClassDetailModal;
const DataCard = ({ icon, title, value }) => {
  return (
    <div className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#f84178]/30 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-sm font-medium text-gray-500">{title}</p>
          <p className="truncate text-base font-bold text-gray-800 transition-colors group-hover:text-[#f84178]">
            {value}
          </p>
        </div>
        <div className="flex-shrink-0 rounded-lg bg-gray-50 p-2 transition-colors group-hover:bg-[#f84178]/10">
          {icon}
        </div>
      </div>
    </div>
  );
};
