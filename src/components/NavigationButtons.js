import React, { useContext } from 'react'
import { TextPairContext } from './App'

export default function NavigationButtons() {
  const { 
    handleProceedToNextSentence,
    handleGoBackToPreviousSentence,
    numberOfSentences, 
    currentSentence 
  } = useContext(TextPairContext);
  
  return (
    <div className='nav-btn-area'>
      <button 
        onClick={handleGoBackToPreviousSentence}
      >
        Previous Sentence
      </button>
      <button 
        onClick={handleProceedToNextSentence}
      >
        Next Sentence
      </button>
      <div>
        You are at sentence {currentSentence + 1} of {numberOfSentences}
      </div>
    </div>
  )
}
