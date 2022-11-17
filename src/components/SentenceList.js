import React, { useContext } from 'react'
import { TextPairContext } from './App'
import Sentence from './Sentence';

export default function SentenceList({texts}) {
  const { 
    handleProceedToNextSentence,
    handleGoBackToPreviousSentence,
    numberOfSentences, 
    currentSentence 
  } = useContext(TextPairContext);

  return (
    <div>
      <div>
        {texts.map(text => {
          return (
            <Sentence key={text.id} sentence={text.sentences[currentSentence]} />
          )
        })}
      </div>
      <div>
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

      </div>
      <div>
        You are at sentence {currentSentence + 1} of {numberOfSentences}
      </div>
    </div>
  );
}
