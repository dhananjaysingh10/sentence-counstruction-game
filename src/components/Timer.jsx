import React, { useEffect, useState } from 'react';

export default function Timer({ duration, onTimeout }) {
  const [seconds, setSeconds] = useState(duration);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeout();
      return;
    }
    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  return <div className="text-right text-gray-500">Time Left: {seconds}s</div>;
}
