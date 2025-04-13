import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Award, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function FeedbackScreen({ questions, userAnswers }) {
  const [expandedQuestions, setExpandedQuestions] = useState({})
  const navigate = useNavigate()
  const toggleQuestion = (id) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getScore = () => {
    let score = 0
    questions.forEach((q, i) => {
      const user = userAnswers[i]
      const userSelection = user.selected || []
      const correctSelection = q.correctAnswer || []

      const minLength = Math.min(userSelection.length, correctSelection.length)
      for (let j = 0; j < minLength; j++) {
        if (userSelection[j] === correctSelection[j]) {
          score++
        }
      }
    })
    return score * 2.5
  }

  const totalScore = getScore()
  const maxScore = questions.length * 10
  const scorePercentage = (totalScore / maxScore) * 100

  const getScoreMessage = () => {
    if (scorePercentage >= 90) return "Excellent! You've mastered this material."
    if (scorePercentage >= 75) return "Great job! You have a solid understanding."
    if (scorePercentage >= 60) return "Good work! Keep practicing to improve."
    if (scorePercentage >= 40) return "You're making progress. Review the material and try again."
    return "Keep studying! You'll improve with practice."
  }

  const getScoreColor = () => {
    if (scorePercentage >= 90) return "text-emerald-600"
    if (scorePercentage >= 75) return "text-green-600"
    if (scorePercentage >= 60) return "text-yellow-600"
    if (scorePercentage >= 40) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Your Results</h1>
          <p className="text-white/80 mt-1">See how well you performed</p>
        </div>

        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                />
                <circle
                  className="text-purple-600 stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - scorePercentage / 100)}`}
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="50"
                  className={`${getScoreColor()} fill-current`}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="bold"
                >
                  {Math.round(scorePercentage)}%
                </text>
              </svg>
            </div>

            <div className="text-center">
              <p className="text-xl">
                You scored{" "}
                <span className={`font-bold ${getScoreColor()}`}>
                  {totalScore} / {maxScore}
                </span>
              </p>
              <p className="text-gray-600 mt-1">{getScoreMessage()}</p>
            </div>

            {scorePercentage >= 75 && (
              <div className="flex items-center justify-center mt-2">
                <Award className="w-8 h-8 text-yellow-500 mr-2" />
                <span className="text-lg font-medium">Achievement Unlocked!</span>
              </div>
            )}
            <Button onClick = {() => navigate('/')}>Home</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold px-1">Question Breakdown</h2>

        {questions.map((q, i) => {
          const user = userAnswers[i]
          const userSelection = user.selected || []
          const correctSelection = q.correctAnswer || []
          const isExpanded = expandedQuestions[q.questionId]

          const isCompletelyCorrect = JSON.stringify(userSelection) === JSON.stringify(correctSelection)

          return (
            <Card
              key={q.questionId}
              className={`overflow-hidden transition-all duration-200 ${
                isCompletelyCorrect ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"
              }`}
            >
              <CardHeader className="pb-2 cursor-pointer" onClick={() => toggleQuestion(q.questionId)}>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <span>Question {i + 1}</span>
                      {isCompletelyCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 ml-2" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-1">{q.question}</CardDescription>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardContent className="pt-4 pb-2 space-y-4">
                    <div className="space-y-2">
                      <p className="text-gray-700">{q.question}</p>

                      <div className="space-y-1">
                        <Badge variant={isCompletelyCorrect ? "success" : "destructive"} className="font-normal">
                          Your Answer
                        </Badge>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {userSelection.length > 0 ? (
                            userSelection.map((opt, idx) => {
                              const isCorrect = opt === correctSelection[idx]
                              return (
                                <span
                                  key={idx}
                                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                                    isCorrect
                                      ? "bg-green-100 text-green-800 border border-green-300"
                                      : "bg-red-100 text-red-800 border border-red-300"
                                  }`}
                                >
                                  {isCorrect ? (
                                    <span className="flex items-center">
                                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                      {opt}
                                    </span>
                                  ) : (
                                    <span className="flex items-center">
                                      <XCircle className="w-3.5 h-3.5 mr-1" />
                                      {opt}
                                    </span>
                                  )}
                                </span>
                              )
                            })
                          ) : (
                            <span className="text-gray-500 italic flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              No answer provided
                            </span>
                          )}
                        </div>
                      </div>

                      {!isCompletelyCorrect && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Badge variant="outline" className="mb-2 bg-white">
                            Correct Answer
                          </Badge>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {correctSelection.map((opt, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300"
                              >
                                <span className="flex items-center">
                                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                  {opt}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </motion.div>
              )}

              {isExpanded && (
                <CardFooter className="pt-0 pb-4 px-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleQuestion(q.questionId)}
                    className="ml-auto text-gray-500"
                  >
                    Close
                  </Button>
                </CardFooter>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
