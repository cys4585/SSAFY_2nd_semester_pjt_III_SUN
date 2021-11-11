import React, { useEffect, useState, useRef, useReducer } from "react"
import { useRouteMatch } from "react-router"
import Header from "../components/Header"
import ChatController from "../components/ys/event/ChatController"
import ChatListContainer from "../components/ys/event/ChatListContainer"
import EventMaterial from "../components/ys/event/EventMaterial"
import ChatAPI from "../api/chat"
import * as SockJS from "sockjs-client"
import * as StompJS from "@stomp/stompjs"
// import SockJS from "sockjs-client"
// import Stomp from "stompjs"
import { useAuthState } from "../context"

export const ChatContext = React.createContext({})

const chatReducer = (state, action) => {
  switch (action.type) {
    case "HISTORY":
      return {
        chatList: [...action.payload.reverse(), ...state.chatList],
        status: "history",
      }
    case "NEW_MESSAGE":
      return {
        chatList: [...state.chatList, action.payload],
        status: "new_message",
      }
  }
}

const EventDetail = () => {
  const auth = useAuthState()
  const { calendarCode, eventId } = useRouteMatch().params

  const [missionId, setMissionId] = useState(null)
  const [roomId, setRoomId] = useState(null)

  const [chatState, dispatch] = useReducer(chatReducer, {
    chatList: [],
    status: null,
  })
  const [lastPage, setLastPage] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const sizePerPage = 15

  useEffect(() => {
    // if (!("Notification" in window)) {
    //   alert("데스크톱 알림을 지원하지 않는 브라우저이다.")
    // }
    // Notification.requestPermission()

    const getChatInfo = async () => {
      const roomInfo = await ChatAPI.getChatRoomInfo(eventId)
      setMissionId(roomInfo.mission_id)
      setRoomId(roomInfo.room_id)

      getHistory(roomInfo.room_id)
      connect(roomInfo.room_id)
    }
    getChatInfo()
    return disconnect()
  }, [])

  const getHistory = async (roomId) => {
    const chatHistoryData = await ChatAPI.getHistory(
      roomId,
      currentPage,
      sizePerPage
    )
    setCurrentPage((prev) => prev + 1)
    console.log(chatHistoryData)
    console.log(chatHistoryData.content)
    chatHistoryData.content = chatHistoryData.content.map((item) => {
      if (item.fileName) {
        return {
          ...item,
          fileUri: `https://d101s.s3.ap-northeast-2.amazonaws.com/${calendarCode}/${item.room_id}/${item.fileUuid}`,
        }
      }
      return item
    })
    console.log(chatHistoryData.content)
    setLastPage(chatHistoryData.totalPages)
    dispatch({ type: "HISTORY", payload: chatHistoryData.content })
  }

  const client = useRef({})

  const connect = (roomId) => {
    client.current = new StompJS.Client({
      webSocketFactory: () => new SockJS("http://13.209.9.223:8080/api/chat"),
      connectHeaders: { Authorization: `${auth.token?.accessToken}` },
      debug: function (str) {
        console.log(str)
      },
      reconnectDelay: 5000,
      onConnect: (frame) => {
        console.log(frame)
        subscribe(roomId)
      },
      onStompError: (frame) => {
        console.log(frame)
      },
    })
    client.current.activate()
  }

  const disconnect = () => {
    if (client.current.connected) client.current.deactivate()
  }

  const subscribe = (roomId) => {
    client.current.subscribe(`/room/${roomId}`, (res) => {
      let resData = JSON.parse(res.body)
      console.log(resData)

      if (resData.fileName) {
        resData = {
          ...resData,
          fileUri: `https://d101s.s3.ap-northeast-2.amazonaws.com/${calendarCode}/${resData.room_id}/${resData.fileUuid}`,
        }
        //   new Notification("새 메세지", { body: "파일" })
        // } else {
        //   new Notification("새 메세지", { body: resData.content })
      }
      console.log(resData)
      dispatch({ type: "NEW_MESSAGE", payload: resData })
    })
  }

  return (
    <ChatContext.Provider
      value={{
        auth,
        missionId,
        roomId,
        chatList: chatState.chatList,
        chatStatus: chatState.status,
        client,
        getHistory,
        lastPage,
        currentPage,
        sizePerPage,
        calendarCode,
      }}
    >
      <div className="h-full flex flex-col">
        <Header
          pageTitle="(임시) Mom Loves Spot 읽기"
          to={`1`}
          backPageTitle="이전"
        />
        <EventMaterial />
        <hr />
        <ChatListContainer />
        <hr />
        <ChatController />
      </div>
    </ChatContext.Provider>
  )
}

export default EventDetail
