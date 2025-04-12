import React, { useEffect, useState } from 'react';
import QuizPage from './pages/QuizPage';
import FeedbackScreen from './components/FeedbackScreen';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/serverRes')
      .then(res => res.json())
      .then((data) => { console.log(data.data.questions); setQuestions(data.data.questions); });
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

  return (
    <QuizPage
      question={questions[currentIndex]}
      onNext={handleAnswer}
      key={currentIndex}
    />
  );
}

export default App;
