import SentenceList from './SentenceList';
import React, { useState, useEffect } from "react";
import '../css/app.css'

export const TextPairContext = React.createContext();

function App() {
  const [texts, setTexts] = useState(sampleTexts);
  const [currentSentence, setCurrentSentence] = useState(0)
  let numberOfSentences = texts[0].sentences.length

  const getTexts = async () => {
    const response = await fetch("http://localhost:3000/");
    const textsFromJSON = await response.json();
    setTexts(textsFromJSON);
  };
  
  
  useEffect(() => {
    getTexts();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown); 
      console.log("Adding!!!!!");

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      console.log("REMOVING!!!!!");
    };
  });

  
  const textPairContextValue = {
    handleProceedToNextSentence,
    handleGoBackToPreviousSentence,
    numberOfSentences,
    currentSentence  
  }

  function handleProceedToNextSentence() {
    const nextSentence = currentSentence < numberOfSentences - 1? currentSentence + 1 : numberOfSentences - 1;
    setCurrentSentence(nextSentence);
  }

  function handleGoBackToPreviousSentence() {
    const prevSentence = currentSentence > 0 ? currentSentence - 1 : 0;
    setCurrentSentence(prevSentence);
  }

  const handleKeyDown = e => {
    const key = e.key;

    if (key === 'ArrowRight') {
      handleProceedToNextSentence();
    }
    else if (key === 'ArrowLeft') {
      handleGoBackToPreviousSentence();
    }
  };


  return (
    <TextPairContext.Provider value={textPairContextValue}>
      <div>
        <SentenceList texts={texts} />
      </div>
    </TextPairContext.Provider>
  )
}

const sampleTexts = [
  {
    id: 1,
    sentences: [""]
  },
  {
    id: 2,
    sentences: [""]
  },
];
  
export default App;
