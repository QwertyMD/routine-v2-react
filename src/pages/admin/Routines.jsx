import { fetchRoutineByGroupId } from "@/services/routineServices";
import { getAllGroups } from "@/services/groupServices";
import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  Filter,
  X,
  Edit,
  Trash2,
  Plus,
  Search,
  RotateCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/services/axiosInterceptor";
import { API_ENDPOINTS } from "@/config/apiConfig";
import SyncStatModal from "@/components/admin/SyncStatModal";

const Routines = () => {
  const [routineData, setRoutineData] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("all");
  const [groupedByBatch, setgroupedByBatch] = useState(new Map());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncModalVisibile, setIsSyncModalVisibile] = useState(false);
  const [syncStats, setSyncStats] = useState(null);
  // Fetch all groups for filter chips
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setGroupsLoading(true);
        const groupsData = await getAllGroups();
        setGroups(groupsData || []);
        setSelectedGroup(groupsData?.[0] || null);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        toast.error("Failed to load groups");
      } finally {
        setGroupsLoading(false);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      groupRoutineByBatch();
    }
  }, [groups]);

  // Initial fetch
  useEffect(() => {
    if (selectedGroup) {
      fetchRoutineData();
    } else {
      setRoutineData(null);
      setIsLoading(false);
    }
  }, [selectedGroup]);

  // Fetch routine data
  const fetchRoutineData = async (groupId) => {
    if (!groupId) {
      console.log("No group selected, skipping fetch.");
      setRoutineData(null);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const params = groupId ? { groupId } : {};
      const queryString = new URLSearchParams(params).toString();

      console.log("Fetching routines with params:", queryString);
      const data = await fetchRoutineByGroupId(queryString);
      setRoutineData(data);
      console.log("Admin routines fetched:", data);
    } catch (err) {
      console.error("Failed to save routine:", err);
      toast.error("Failed to save routine");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle group chip click
  const handleGroupSelect = (group) => {
    if (selectedGroup?.id === group.id) {
      // setSelectedGroup(null);
      // fetchRoutineData();
      const firstGroup = groups[0];
      if (firstGroup && firstGroup.id !== group.id) {
        setSelectedGroup(firstGroup);
      }
    } else {
      setSelectedGroup(group);
      fetchRoutineData(group.id);
    }
  };

  const clearGroupFilter = () => {
    if (groups.length > 0) {
      setSelectedGroup(groups[0]);
    }
  };

  const handleEditRoutine = (routine) => {
    setEditingRoutine(routine);
  };

  const handleDeleteRoutine = (routine) => {
    setShowDeleteModal(routine);
  };

  const confirmDelete = async () => {
    try {
      // TODO: Implement delete API call
      // await deleteRoutine(showDeleteModal.id);
      toast.success("Routine deleted successfully");
      setShowDeleteModal(null);
      fetchRoutineData(selectedGroup?.id);
    } catch (err) {
      console.error("Delete routine error:", err);
      toast.error("Failed to delete routine");
    }
  };

  const handleCreateRoutine = () => {
    setEditingRoutine({
      id: null,
      startTime: "",
      endTime: "",
      moduleCode: "",
      moduleName: "",
      classType: "Lecture",
      room: "",
      teacher: "",
      isActive: true,
      day: "mon",
    });
  };

  // Save routine (create or update)
  const handleSaveRoutine = async (routineData) => {
    try {
      if (routineData.id) {
        // Update existing routine
        toast.success("Routine updated successfully");
      } else {
        // Create new routine
        toast.success("Routine created successfully");
      }
      setEditingRoutine(null);
      fetchRoutineData(selectedGroup?.id);
    } catch (err) {
      console.error("Save routine error:", err);
      toast.error("Failed to save routine");
    }
  };

  // Filter routines for table display
  const getFilteredRoutines = () => {
    if (!routineData?.week) return [];

    let allRoutines = [];
    routineData.week.forEach((dayData) => {
      dayData.slots?.forEach((slot) => {
        allRoutines.push({
          ...slot,
          day: dayData.day,
        });
      });
    });

    // Apply filters
    return allRoutines.filter((routine) => {
      const matchesSearch =
        !searchTerm ||
        routine.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        routine.moduleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        routine.teacher.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDay = selectedDay === "all" || routine.day === selectedDay;

      return matchesSearch && matchesDay;
    });
  };

  // Format time range
  const formatTimeRange = (startTime, endTime) => {
    const formatTime = (time) => {
      const [hours, minutes] = time.split(":");
      const hour12 = hours % 12 || 12;
      const ampm = hours >= 12 ? "PM" : "AM";
      return `${hour12}:${minutes} ${ampm}`;
    };
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  // Get class type styling
  const getClassTypeStyling = (classType) => {
    const type = classType?.split(" ")[0]?.toLowerCase() || "lecture";

    switch (type) {
      case "lecture":
        return {
          cardBg: "bg-indigo-50 dark:bg-indigo-900/20",
          accentColor: "bg-indigo-500",
          badgeColor: "bg-indigo-100 text-indigo-700",
          borderColor: "border-indigo-200",
        };
      case "tutorial":
        return {
          cardBg: "bg-emerald-50 dark:bg-emerald-900/20",
          accentColor: "bg-emerald-500",
          badgeColor: "bg-emerald-100 text-emerald-700",
          borderColor: "border-emerald-200",
        };
      case "workshop":
        return {
          cardBg: "bg-orange-50 dark:bg-orange-900/20",
          accentColor: "bg-orange-500",
          badgeColor: "bg-orange-100 text-orange-700",
          borderColor: "border-orange-200",
        };
      default:
        return {
          cardBg: "bg-gray-50 dark:bg-gray-900/20",
          accentColor: "bg-gray-500",
          badgeColor: "bg-gray-100 text-gray-700",
          borderColor: "border-gray-200",
        };
    }
  };

  const groupRoutineByBatch = () => {
    const result = new Map();
    if (!groups || groups.length === 0) return result;

    // if (!groups || groups.length === 0) return;
    groups.forEach((group) => {
      // console.log("Processing group for batch extraction:", group);
      const extractBatch = group.name[0] + group.name[1];
      // result.set(extractBatch,)
      if (result.has(extractBatch)) {
        result.get(extractBatch).push(group);
      } else {
        result.set(extractBatch, [group]);
      }
    });

    setgroupedByBatch(result);
    console.log("Grouped Routines by Batch:", result);
    return result;
  };

  const handleSyncRoutine = async () => {
    setIsSyncing(true);
    try {
      const result = await axiosInstance.post(API_ENDPOINTS.syncWeeklyRoutine, {
        startDate: new Date(),
      });
      if (!result) {
        throw new Error("No response from server");
      }
      console.log("Sync result:", result.data);
      setIsSyncModalVisibile(true);
      setSyncStats(result.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to sync routines");
    } finally {
      setIsSyncing(false);
    }
  };
  return (
    <div className="min-h-screen p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Routine Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage and view all routine schedules
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50">
              <Upload className="h-4 w-4" />
              Import
            </button> */}
            <Button
              // className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50"
              // variant=
              disabled={isSyncing}
              variant="outline"
              onClick={handleSyncRoutine}
            >
              <RotateCw
                className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
              />
              Sync
            </Button>
            <button
              onClick={handleCreateRoutine}
              className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600"
            >
              <Plus className="h-4 w-4" />
              Add Routine
            </button>
          </div>
        </div>

        {/* Group Filter Chips */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filter by Group
            </h2>
            {selectedGroup && (
              <button
                onClick={clearGroupFilter}
                className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
              >
                <X className="h-3 w-3" />
                Clear Filter
              </button>
            )}
          </div>

          <div className="flex flex-col flex-wrap gap-2">
            {groupsLoading ? (
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 animate-pulse rounded-full bg-gray-200"
                  />
                ))}
              </div>
            ) : groupedByBatch.size > 0 ? (
              Array.from(groupedByBatch.entries()).map(([batch, groupList]) => (
                <div key={batch} className="flex">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                      {batch} Batch
                    </h3>
                    <div className="h-px flex-1 bg-gray-200"></div>
                    <span className="text-xs text-gray-500">
                      {groupList.length} group
                      {groupList.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pl-4">
                    {groupList.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => handleGroupSelect(group)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                          selectedGroup?.id === group.id
                            ? "bg-indigo-500 text-white shadow-md"
                            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Users className="h-4 w-4" />
                        {group.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div>Hello</div>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search routines by module, code, or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Days</option>
            <option value="mon">Monday</option>
            <option value="tue">Tuesday</option>
            <option value="wed">Wednesday</option>
            <option value="thu">Thursday</option>
            <option value="fri">Friday</option>
            <option value="sat">Saturday</option>
            <option value="sun">Sunday</option>
          </select>
        </div>

        {/* Routines Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Module
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Day & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Teacher
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                      </td>
                    </tr>
                  ))
                ) : getFilteredRoutines().length > 0 ? (
                  getFilteredRoutines().map((routine, index) => {
                    const styling = getClassTypeStyling(routine.classType);
                    return (
                      <tr
                        key={index}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {routine.moduleName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {routine.moduleCode}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium capitalize text-gray-900">
                              {routine.day === "sun"
                                ? "Sunday"
                                : routine.day === "mon"
                                  ? "Monday"
                                  : routine.day === "tue"
                                    ? "Tuesday"
                                    : routine.day === "wed"
                                      ? "Wednesday"
                                      : routine.day === "thu"
                                        ? "Thursday"
                                        : routine.day === "fri"
                                          ? "Friday"
                                          : "Saturday"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatTimeRange(
                                routine.startTime,
                                routine.endTime,
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${styling.badgeColor}`}
                          >
                            {routine.classType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {routine.room}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {routine.teacher.name}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              routine.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {routine.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditRoutine(routine)}
                              className="text-indigo-600 transition-colors hover:text-indigo-900"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoutine(routine)}
                              className="text-red-600 transition-colors hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                      <h3 className="mb-2 text-lg font-medium text-gray-900">
                        No Routines Found
                      </h3>
                      <p className="mb-4 text-gray-500">
                        {searchTerm
                          ? "No routines match your search criteria."
                          : "No routines available."}
                      </p>
                      <button
                        onClick={handleCreateRoutine}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600"
                      >
                        <Plus className="h-4 w-4" />
                        Add First Routine
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingRoutine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingRoutine.id ? "Edit Routine" : "Create New Routine"}
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveRoutine(editingRoutine);
              }}
              className="space-y-6 p-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Module Information */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Module Code
                  </label>
                  <input
                    type="text"
                    name="moduleCode"
                    value={editingRoutine.moduleCode || ""}
                    onChange={(e) =>
                      setEditingRoutine((prev) => ({
                        ...prev,
                        moduleCode: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Module Name
                  </label>
                  <input
                    type="text"
                    name="moduleName"
                    value={editingRoutine.moduleName || ""}
                    onChange={(e) =>
                      setEditingRoutine((prev) => ({
                        ...prev,
                        moduleName: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Time Information */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={editingRoutine.startTime || ""}
                    onChange={(e) =>
                      setEditingRoutine((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={editingRoutine.endTime || ""}
                    onChange={(e) =>
                      setEditingRoutine((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Class Details */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Class Type
                  </label>
                  <select
                    name="classType"
                    value={editingRoutine.classType || "Lecture"}
                    onChange={(e) =>
                      setEditingRoutine((prev) => ({
                        ...prev,
                        classType: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Lab">Lab</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Day
                  </label>
                  <select
                    name="day"
                    value={editingRoutine.day || "mon"}
                    onChange={(e) =>
                      setEditingRoutine((prev) => ({
                        ...prev,
                        day: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="mon">Monday</option>
                    <option value="tue">Tuesday</option>
                    <option value="wed">Wednesday</option>
                    <option value="thu">Thursday</option>
                    <option value="fri">Friday</option>
                    <option value="sat">Saturday</option>
                    <option value="sun">Sunday</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Room
                  </label>
                  <input
                    type="text"
                    name="room"
                    value={editingRoutine.room || ""}
                    onChange={(e) =>
                      setEditingRoutine((prev) => ({
                        ...prev,
                        room: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Teacher
                  </label>
                  <input
                    type="text"
                    name="teacher"
                    value={editingRoutine.teacher.name || ""}
                    onChange={(e) =>
                      setEditingRoutine((prev) => ({
                        ...prev,
                        teacher: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={editingRoutine.isActive !== false}
                  onChange={(e) =>
                    setEditingRoutine((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Active Routine
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={() => setEditingRoutine(null)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600"
                >
                  {editingRoutine.id ? "Update Routine" : "Create Routine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Delete Routine
              </h3>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete &ldquo;
                {showDeleteModal.moduleName}&rdquo;? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isSyncModalVisibile && (
        <SyncStatModal
          onClose={() => setIsSyncModalVisibile(false)}
          syncStats={syncStats}
        />
      )}
    </div>
  );
};

export default Routines;
