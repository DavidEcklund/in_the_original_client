import React, { useContext } from 'react'
import { TextPairContext } from './App'

export default function Sentence({ sentences }) {
  const { currentSentence } = useContext(TextPairContext);

  return (
    <div>
      {sentences[currentSentence]}
    </div>
  )
}
