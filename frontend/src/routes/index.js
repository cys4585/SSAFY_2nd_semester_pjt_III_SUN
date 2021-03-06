import Login from "../pages/Login"
import ResetPassword from "../pages/ResetPassword"
import Profile from "../pages/Profile"
import Register from "../pages/Register"
import ProfileEdit from "../pages/ProfileEdit"
import ChangePassword from "../pages/ChangePassword"
import CalendarLayout from "../layouts/CalendarLayout"
import FindAuth from "../pages/FindAuth"
import NotiCenter from "../pages/NotiCenter"
import ChatCenter from "../pages/ChatCenter"

const routes = [
  {
    path: "/login",
    component: Login,
    requiresNoAuth: true,
  },
  {
    path: "/register",
    component: Register,
    requiresNoAuth: true,
  },
  {
    path: "/auth/find-auth",
    component: FindAuth,
    requiresNoAuth: true,
  },
  {
    path: "/auth/reset-password",
    component: ResetPassword,
    requiresNoAuth: true,
  },
  {
    path: "/calendars",
    component: CalendarLayout,
    requiresAuth: true,
  },
  {
    path: "/notifications",
    component: NotiCenter,
    requiresAuth: true,
  },
  {
    path: "/chats",
    component: ChatCenter,
    requiresAuth: true,
  },
  {
    path: "/profile/edit",
    component: ProfileEdit,
    requiresAuth: true,
  },
  {
    path: "/profile/change-password",
    component: ChangePassword,
    requiresAuth: true,
  },
  {
    path: "/profile/:userId",
    component: Profile,
    requiresAuth: true,
  },
]

export default routes
