export default function FeedbackScreen({ questions, userAnswers }) {
    const getScore = () => {
      let score = 0;
      questions.forEach((q, i) => {
        const user = userAnswers[i];
        if (JSON.stringify(user.selected) === JSON.stringify(q.correctAnswer)) {
          score++;
        }
      });
      return score;
    };
  
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Results</h2>
        <p className="text-lg mb-4">Score: {getScore()} / {questions.length}</p>
  
        {questions.map((q, i) => {
          const user = userAnswers[i];
          const isCorrect = JSON.stringify(user.selected) === JSON.stringify(q.correctAnswer);
          return (
            <div key={q.questionId} className="mb-4 border-b pb-2">
              <p className="font-semibold">Q{i + 1}:</p>
              <p>Your Answer: {user.selected.join(' ')}</p>
              <p className={isCorrect ? "text-green-500" : "text-red-500"}>
                {isCorrect ? "Correct ✅" : `Incorrect ❌ | Correct Answer: ${q.correctAnswer.join(' ')}`}
              </p>
            </div>
          );
        })}
      </div>
    );
  }
  