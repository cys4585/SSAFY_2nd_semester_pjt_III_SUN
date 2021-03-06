import { useMemo } from "react"
import { createPortal } from "react-dom"

const Portal = ({ children, elementId = "root" }) => {
  const rootElement = useMemo(
    () => document.getElementById(elementId),
    [elementId]
  )

  return createPortal(children, rootElement)
}

export default Portal
