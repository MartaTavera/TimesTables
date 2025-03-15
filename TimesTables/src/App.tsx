import { SetStateAction, useState, useRef, useEffect } from 'react';
import MathsCover from './assets/MathsCover.png'
import './App.css';


function App() {
  function generateMultiplicationQuestion():{ question: string, correctAnswer: number }{
    const factor1 = Math.floor(Math.random() * 10  + 2);
    const factor2 =  Math.floor(Math.random() * 10 + 2);
    const correctAnswer = factor1 * factor2;
    const question = `${factor1} × ${factor2} `;
    console.log(factor1, factor2)
    console.log("answers ", correctAnswer);
    return {question, correctAnswer}
  }
  const [questions, setQuestions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswersIndex, setCorrectAnswersIndex] = useState(0)
  const [feedback, setFeedback] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState("");
  const inputRef = useRef(null);
  
useEffect(()=>{
  const generateQuestions = (count = 3)=>{
    const newQuestions =[];
    const correctAnswers =[];
    for (let i = 0; i < count; i++) {
      const generatedQuestion = generateMultiplicationQuestion();
      newQuestions.push(generatedQuestion.question);
      correctAnswers.push(generatedQuestion.correctAnswer);
    }
    setQuestions(newQuestions);
    setCorrectAnswers(correctAnswers);

    console.log("Questions:", newQuestions);
    console.log("Answers: ",correctAnswers);
  };
 generateQuestions();
}, []);


const handleSubmit = (e: { preventDefault: () => void; }) => {
  e.preventDefault();
  const correctResult = (parseInt(userAnswer) === correctAnswers[currentQuestionIndex]);
    setResult(correctResult? "correct": "incorrect")
    
  setFeedback(true);
  setUserAnswer("");
  if (currentQuestionIndex < questions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setCorrectAnswersIndex(currentQuestionIndex + 1);
  } else {
    setCurrentQuestionIndex(questions.length);
    setCorrectAnswersIndex(questions.length)
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
        {feedback && (
          <div className="answer-feedback">
          {result == "correct" ? '✓' : `✗`}
        </div>  
         )}
      
      </div>
      ) : (
        <div className="end-quiz-text">Quiz completed!</div>
      )}
    </div>  
  
);
}

export default App;
