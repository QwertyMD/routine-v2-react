export const API_BASE_URL = "http://localhost:3000/api";

export const API_ENDPOINTS = {
  signup: "/auth/signup",
  login: "/auth/login",

  profile: "user/profile",
  
  groups: "/groups",
  modules: "/module",
  rooms: "/room",
  teachers: "/teacher",
  
  routineByUserGroup: "/routines/group",
  adminRoutines: "/routines/admin/group",
  syncWeeklyRoutine: "/routines/admin/sync-weekly",

  issues: "/issues",
  issuesAdmin: "/issues/admin",
  issuesAdminStats: "/issues/admin/stats",
  myIssues: "/issues/my-issues",

  users: "/user/users"
};
