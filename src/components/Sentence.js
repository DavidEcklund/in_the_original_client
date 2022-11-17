import React, { useContext } from 'react'
import { TextPairContext } from './App'

export default function Sentence({ sentences }) {
  const { currentSentence } = useContext(TextPairContext);

  // console.log(text, 'text in Sentence');
  // console.log(sentences, 'sentences in Sentence');
  // console.log(currentSentence, 'currentSentence');

  return (
    <div>
      {sentences[currentSentence]}
    </div>
  )
}
