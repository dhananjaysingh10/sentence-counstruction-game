import React, { useEffect, useState } from 'react';
import QuizPage from './QuizPage';
import FeedbackScreen from '../components/FeedbackScreen';
import { Progress } from '@/components/ui/progress'; 
import { CheckCircle } from 'lucide-react'; 

function GamePage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}`)
      .then(res => res.json())
      .then((data) => {
        // console.log(data.data);
        setQuestions(data.serverRes.data.questions);
      });
  }, []);

  const handleAnswer = (answer) => {
    setUserAnswers([...userAnswers, answer]);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowFeedback(true);
    }
  };

  if (showFeedback) {
    return <FeedbackScreen questions={questions} userAnswers={userAnswers} />;
  }

  const progress = (userAnswers.length / questions.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      {/* Top Progress Info */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>

        <Progress
  value={progress}
  className="w-full h-2 bg-gray-300 [&>div]:bg-black rounded-full"
/>

        <div className="flex justify-between mt-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                index < userAnswers.length
                  ? 'bg-green-100 text-green-700'
                  : index === currentIndex
                  ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {index < userAnswers.length ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Render current question */}
      {questions.length > 0 && (
        <QuizPage
          question={questions[currentIndex]}
          onNext={handleAnswer}
          key={currentIndex}
        />
      )}
    </div>
  );
}

export default GamePage;
