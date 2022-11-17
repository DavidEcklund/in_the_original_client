import React, { useContext } from 'react'
import { TextPairContext } from './App'
import Sentence from './Sentence';

export default function SentenceList({texts}) {
  const { handleProceedToNextSentence } = useContext(TextPairContext);

  return (
    <div>
      <div>
        {texts.map(text => {
          return (
            <Sentence key={text.id} {...text} />
          )
        })}
      </div>
      <div>
        <button 
          onClick={handleProceedToNextSentence}
        >
          Next Sentence
        </button>
      </div>
    </div>
  );
}
