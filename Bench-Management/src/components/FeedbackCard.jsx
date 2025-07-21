// src/components/FeedbackCard.jsx
import React, { useMemo } from 'react';

const FeedbackCard = ({ feedbackString }) => {

  const feedback = useMemo(() => {
    // These regex parsers remain the same to extract the data
    const trainerRegex = /^Training on (\d{4}-\d{2}-\d{2}) by .*?: (.*)$/;
    const interviewRegex = /^\s*\((\d{4}-\d{2}-\d{2})\):\s*(.*)$/;

    const trainerMatch = feedbackString.match(trainerRegex);
    if (trainerMatch) {
      return {
        date: trainerMatch[1],
        text: trainerMatch[2],
      };
    }

    const interviewMatch = feedbackString.match(interviewRegex);
    if (interviewMatch) {
      return {
        date: interviewMatch[1],
        text: interviewMatch[2],
      };
    }
    
    // Fallback if no date is found
    return { text: feedbackString };
  }, [feedbackString]);

  // Render a simple list item
  return (
    <li className="feedback-list-item">
      {feedback.date && <strong className="feedback-date">{feedback.date}: </strong>}
      <span className="feedback-text">{feedback.text}</span>
    </li>
  );
};

export default FeedbackCard;