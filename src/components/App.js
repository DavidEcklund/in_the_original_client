import '../css/App.css';
import SentenceList from './SentenceList';
import React, { useState, useEffect } from "react";

export const TextPairContext = React.createContext();
// const LOCAL_STORAGE_KEY = 'inTheOriginal.texts'

function App() {
  const [texts, setTexts] = useState(sampleTexts);
  const [currentSentence, setCurrentSentence] = useState(0)

  // useEffect(() => {
  //   const textJSON = localStorage.getItem(LOCAL_STORAGE_KEY)
  //   if (textJSON != null) setTexts(JSON.parse(textJSON))
  // }, [])

  // const getTexts = async () => {
  //   const response = await fetch("http://localhost:3000/");
  //   const objFromJSON = await response.json();
  //   const texts = objFromJSON.texts; 
  //   setTexts(texts);
  // };
  
  
  // useEffect(() => {
  //   getTexts();
  // }, []);
  
  // console.log(texts);

  const textPairContextValue = {
    handleProceedToNextSentence,
    currentSentence  
  }

  function handleProceedToNextSentence() {
    setCurrentSentence(currentSentence + 1);
  }

  // console.log(texts, 'texts in App', Object.getPrototypeOf(texts));


  return (
    <TextPairContext.Provider value={textPairContextValue}>
      <SentenceList texts={texts} />
    </TextPairContext.Provider>
  )
}

const sampleTexts = [
  {
    id: 1,
    sentences: ["Hello, World!", "Here's another sentence.", "Third sentence here."]
  },
  {
    id: 2,
    sentences: ["Hi, Mom!", "Sentence 2.", "Sentence 3."]
  },
];
  
export default App;
