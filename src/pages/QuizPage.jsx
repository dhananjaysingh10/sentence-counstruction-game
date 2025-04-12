import React from 'react';
import SentenceQuestion from '../components/SentenceQuestion';

export default function QuizPage({ question, onNext }) {
  if (!question) {
    return <div className="text-center p-8 text-lg">Loading question...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6">
        <SentenceQuestion question={question} onNext={onNext} />
      </div>
    </div>
  );
}
