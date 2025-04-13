import { useState, useEffect } from "react"
const Timer = ({ duration, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60)

  useEffect(() => {
    if (!timeLeft) {
      onTimeout()
      return
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [timeLeft, onTimeout])

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return <span>{formatTime(timeLeft)}</span>
}

export default Timer
