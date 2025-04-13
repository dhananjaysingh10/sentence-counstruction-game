import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Home, Clock, AlertCircle, CheckCircle, X } from "lucide-react"
import Timer from "./Timer"

export default function SentenceQuestion({ question, onNext }) {
  const blankCount = question.correctAnswer.length
  const [filled, setFilled] = useState(Array(blankCount).fill(null))
  const [used, setUsed] = useState([])
  const [timeUp, setTimeUp] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [draggedWord, setDraggedWord] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    setFilled(Array(blankCount).fill(null))
    setUsed([])
    setTimeUp(false)
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent))
  }, [question, blankCount])

  const handleDrop = (e, index) => {
    e.preventDefault()
    const word = e.dataTransfer.getData("text/plain")
    if (!used.includes(word)) {
      const newFilled = [...filled]
      newFilled[index] = word
      setFilled(newFilled)
      setUsed([...used, word])
    }
    setDragOverIndex(null)
  }

  const handleDragStart = (e, word) => {
    e.dataTransfer.setData("text/plain", word)
    setDraggedWord(word)
  }

  const handleDragEnd = () => {
    setDraggedWord(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleBlankClick = (index) => {
    const wordToRemove = filled[index]
    if (wordToRemove) {
      const newUsed = used.filter((word) => word !== wordToRemove)
      const newFilled = [...filled]
      newFilled[index] = null
      setUsed(newUsed)
      setFilled(newFilled)
    }
  }

  const handleTimeout = () => {
    setTimeUp(true)
    onNext({ questionId: question.questionId, selected: filled })
  }

  const handleNextClick = () => {
    if (!filled.includes(null)) {
      onNext({ questionId: question.questionId, selected: filled })
    }
  }

  const handleMobileOptionClick = (word) => {
    if (used.includes(word)) return

    const nextEmptyIndex = filled.findIndex((f) => f === null)
    if (nextEmptyIndex !== -1) {
      const newFilled = [...filled]
      newFilled[nextEmptyIndex] = word
      setFilled(newFilled)
      setUsed([...used, word])
    }
  }

  const completionPercentage = (filled.filter(Boolean).length / blankCount) * 100

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <Card className="shadow-lg border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex justify-between items-center">
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-600/50" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            <span>Exit</span>
          </Button>

          <div className="flex items-center bg-white/20 px-3 py-1.5 rounded-full text-white">
            <Clock className="w-4 h-4 mr-2" />
            <Timer duration={0.5} onTimeout={handleTimeout} />
          </div>
        </div>

        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-800 mb-2">Complete the sentence:</h2>
            <Progress value={completionPercentage} className="h-2 mb-2" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>
                {filled.filter(Boolean).length} of {blankCount} filled
              </span>
              {completionPercentage === 100 && (
                <span className="text-green-500 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" /> Complete
                </span>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-100">
            <p className="text-lg leading-relaxed flex flex-wrap items-center gap-2">
              {question.question.split(/_+/g).map((part, index) => (
                <React.Fragment key={index}>
                  <span className="text-gray-800">{part.trim()}</span>
                  {index < blankCount && (
                    <span
                      onDrop={(e) => !isMobile && handleDrop(e, index)}
                      onDragOver={(e) => !isMobile && handleDragOver(e, index)}
                      onDragLeave={() => !isMobile && handleDragLeave()}
                      onClick={() => handleBlankClick(index)}
                      className={`min-w-[100px] h-10 px-3 inline-flex items-center justify-center rounded-md transition-all ${
                        filled[index]
                          ? "bg-blue-100 border border-blue-300 text-blue-800 hover:bg-blue-50"
                          : dragOverIndex === index
                            ? "bg-blue-50 border-2 border-blue-400 border-dashed"
                            : "bg-white border border-gray-300 text-gray-400"
                      }`}
                    >
                      {filled[index] ? (
                        <div className="flex items-center justify-between w-full">
                          <span>{filled[index]}</span>
                          <X className="w-3.5 h-3.5 ml-1 text-gray-500 hover:text-red-500" />
                        </div>
                      ) : (
                        <span className="text-gray-400">____</span>
                      )}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              {isMobile ? "Tap a word to fill in the blanks:" : "Drag words to fill in the blanks:"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {question.options.map((word, i) => (
                <div
                  key={i}
                  draggable={!isMobile && !used.includes(word)}
                  onDragStart={(e) => !isMobile && handleDragStart(e, word)}
                  onDragEnd={handleDragEnd}
                  onClick={() => isMobile && handleMobileOptionClick(word)}
                  className={`px-4 py-2 rounded-full select-none transition-all ${
                    used.includes(word)
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : draggedWord === word
                        ? "bg-blue-100 border border-blue-400 text-blue-700 shadow-md"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
                  }`}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>

          {timeUp ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center text-amber-700 mb-4">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <p>Time's up! Your answer has been submitted.</p>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button
                onClick={handleNextClick}
                disabled={filled.includes(null)}
                className={`transition-all ${filled.includes(null) ? "opacity-70" : "shadow-md hover:shadow-lg"}`}
                size="lg"
              >
                {filled.includes(null) ? "Fill all blanks to continue" : "Submit Answer"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
