import '../css/App.css';
import Sentence from './Sentence';
// import React, { useState, useEffect } from "react";

function App() {
  // const [answer, setAnswer] = useState();

  // const getAnswer = async () => {
  //   const response = await fetch("http://localhost:3000/");
  //   const objFromJSON = await response.json();
  //   const answer = objFromJSON.msg; 
  //   setAnswer(answer);
  // };
  
  
  // useEffect(() => {
  //   getAnswer();
  // }, []);
  
  return (
    <>
      <Sentence />
      <Sentence />
    </>
  )
}
  
export default App;
