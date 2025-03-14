import { SetStateAction, useState, useRef, useEffect } from 'react';
import MathsCover from './assets/MathsCover.png'
import './App.css';


function App() {
  function generateMultiplicationQuestion():string{
    const factor1 = Math.floor(Math.random() * 12  + 1);
    const factor2 =  Math.floor(Math.random() * 12 + 1);
    const correctAnswer = factor1 * factor2;
    const question = `${factor1} × ${factor2} `;
    return question 
  }

  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const inputRef = useRef(null);
  
useEffect(()=>{
  const generateQuestions = (count = 10)=>{
    const newQuestions: string[] = [];
    for (let i = 0; i < count; i++) {
      newQuestions.push(generateMultiplicationQuestion());
      console.log("pq no veo mis preguntas loop", i);
    }
    console.log("Questions:", newQuestions);
    return newQuestions;
  };
    setQuestions(generateQuestions());
}, []);


const handleSubmit = (e: { preventDefault: () => void; }) => {
  e.preventDefault();
  const currentAnswer = userAnswer; 
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
        <div className="end-quiz-text">Quiz completed!</div>
      )}
    </div>  
  
);
}

export default App;
