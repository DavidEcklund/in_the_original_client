import React, { useContext } from 'react'
import { TextPairContext } from './App'

export default function Sentence(text) {
  const { currentSentence } = useContext(TextPairContext);

  // console.log(text, 'text in Sentence');
  // console.log(currentSentence, 'currentSentence');

  return (
    <div>
      {text.sentences[currentSentence]}
    </div>
  )
}
