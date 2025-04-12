import React, { useState, useEffect } from 'react';
import Timer from './Timer';

export default function SentenceQuestion({ question, onNext }) {
  const blankCount = question.correctAnswer.length;
  const [filled, setFilled] = useState(Array(blankCount).fill(null));
  const [used, setUsed] = useState([]);
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    setFilled(Array(blankCount).fill(null));
    setUsed([]);
    setTimeUp(false);
  }, [question]);

  const handleDrop = (e, index) => {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain');
    if (!used.includes(word)) {
      const newFilled = [...filled];
      newFilled[index] = word;
      setFilled(newFilled);
      setUsed([...used, word]);
    }
  };
  
  const handleDragStart = (e, word) => {
    e.dataTransfer.setData('text/plain', word);
  };

  const handleBlankClick = (index) => {
    const wordToRemove = filled[index];
    if (wordToRemove) {
      const newUsed = used.filter(word => word !== wordToRemove);
      const newFilled = [...filled];
      newFilled[index] = null;
      setUsed(newUsed);
      setFilled(newFilled);
    }
  };

  const handleTimeout = () => {
    setTimeUp(true);
    onNext({ questionId: question.questionId, selected: filled });
  };

  const handleNextClick = () => {
    if (!filled.includes(null)) {
      onNext({ questionId: question.questionId, selected: filled });
    }
  };

  return (
    <div className="p-4">
      <Timer duration={30} onTimeout={handleTimeout} />

      <h2 className="text-lg font-semibold mb-4">Complete the sentence:</h2>

      {/* Sentence with correct blanks */}
      <p className="mb-6 text-lg flex flex-wrap items-center gap-2">
  {question.question.split(/_+/g).map((part, index) => (
    <span key={index} className="flex items-center gap-1">
      <span>{part.trim()}</span>
      {index < question.correctAnswer.length && (
        <span
          onDrop={(e) => handleDrop(e, index)}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => handleBlankClick(index)}
          className="min-w-[80px] h-9 px-2 py-1 border-b-2 border-black rounded bg-gray-100 text-center inline-flex items-center justify-center cursor-pointer"
        >
          {filled[index] || '____'}
        </span>
      )}
    </span>
  ))}
</p>


      {/* Draggable word options */}
      <div className="flex flex-wrap gap-3 mb-6">
        {question.options.map((word, i) => (
          <div
            key={i}
            draggable={!used.includes(word)}
            onDragStart={(e) => handleDragStart(e, word)}
            className={`px-3 py-1 border rounded cursor-move select-none ${
              used.includes(word)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-200 hover:bg-blue-300'
            }`}
          >
            {word}
          </div>
        ))}
      </div>

      {/* Next button */}
      {!timeUp && (
        <button
          onClick={handleNextClick}
          disabled={filled.includes(null)}
          className={`px-5 py-2 rounded text-white transition ${
            filled.includes(null)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          Next
        </button>
      )}
    </div>
  );
}
