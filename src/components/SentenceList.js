import React, { useContext } from 'react'
import { TextPairContext } from './App'
import Sentence from './Sentence';

export default function SentenceList() {
  const { 
    texts,
    currentSentence 
  } = useContext(TextPairContext);

  return (
    <div>
      <div className='sentence-list'>
        {texts.map(text => {
          return (
            <Sentence key={text.id} sentence={text.sentences[currentSentence]} />
          )
        })}
      </div>
    </div>
  );
}
