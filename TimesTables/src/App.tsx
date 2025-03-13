import { SetStateAction, useState, useRef } from 'react';

import './App.css';


function App() {


  
  const questions = [
    "2 x 4", "3 x 9", "9 x 5", "6 x 7", "8 x 4"   
  ];
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const inputRef = useRef(null);

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(questions.length); // Set to length to show final score
    }
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    const currentAnswer = userAnswer; 
    // Clear the input immediately
    setUserAnswer("");
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(questions.length);
    }
 
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
  setUserAnswer(e.target.value);
};
return (
  <div>
    {currentQuestionIndex < questions.length ? (
      <div className='question-box'>
        <form onSubmit={handleSubmit}>
          <label style={{
          display: 'inline-block'}}>
          {questions[currentQuestionIndex]} =
          </label>
          <input className='user-answer'
          type="number"
          value={userAnswer}
          onChange={handleInputChange}         
          ref={inputRef}
          autoFocus
          />
        </form>
      </div>   
      ) : (
        <div>Quiz completed!</div>
      )}
    </div>  
  
);
}

export default App;
