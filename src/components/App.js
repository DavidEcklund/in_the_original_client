import '../css/App.css';
import React, { useState, useEffect } from "react";

function App() {
  const [answer, setAnswer] = useState();

  const getAnswer = async () => {
    const res = await fetch("http://localhost:3000/");
    const answer = await res.json();
    setAnswer(answer);
  };

  useEffect(() => {
    getAnswer();
  }, []);

  return <div className="App">{answer.msg}</div>;
}
  
export default App;
