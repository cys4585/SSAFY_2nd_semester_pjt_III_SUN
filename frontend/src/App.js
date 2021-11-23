import { useEffect, useState } from "react"
import { Switch } from "react-router"
import "./App.css"
import AppRoute from "./components/AppRoute"
import NoMatchRoute from "./components/NoMatchRoute"
import {
  useAuthDispatch,
  useCalendarDispatch,
  setCurrentCalendar,
  useAuthState,
} from "./context"
import BottomNav from "./components/BottomNav"
import routes from "./routes"

function App() {
  const authDispatch = useAuthDispatch()
  const calendarDispatch = useCalendarDispatch()
  const authState = useAuthState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function asyncEffect() {
      const user = JSON.parse(localStorage.getItem("currentUser"))
      if (user) {
        // TODO: authState를 payload로 전달하지 않고 다른 방법으로 token을 전달하기
        // await silentRefresh(authDispatch, user.token?.refreshToken)
        setCurrentCalendar(calendarDispatch, user.user.defaultCalendar)
      }
      setLoading(false)
    }
    asyncEffect()
  }, [authDispatch, calendarDispatch])

  useEffect(() => {
    window.addEventListener(
      "dragover",
      (event) => {
        event.preventDefault()
        event.dataTransfer.effectAllowed = "none"
        event.dataTransfer.dropEffect = "none"
      },
      false
    )

    window.addEventListener(
      "drop",
      (event) => {
        event.preventDefault()
        event.dataTransfer.effectAllowed = "none"
        event.dataTransfer.dropEffect = "none"
      },
      false
    )
  }, [])

  // useEffect(() => {
  //   if (authState?.user?.id) {
  //     const sse = new EventSource(
  //       `/api/notification/subscribe/${authState.user.id}`
  //     )
  //     sse.onopen = () => {
  //       alert("sse 연결")
  //     }
  //     sse.onmessage = (e) => {
  //       alert(e)
  //     }
  //     sse.onerror = () => sse.close()
  //     return () => {
  //       sse.close()
  //     }
  //   }
  // }, [authState])

  return (
    <main className="h-full max-h-full pb-16">
      {!loading && (
        <Switch>
          {routes.map(({ path, component, ...rest }) => (
            <AppRoute key={path} component={component} path={path} {...rest} />
          ))}
          <NoMatchRoute />
        </Switch>
      )}
      <BottomNav />
    </main>
  )
}

export default App
