import { SetStateAction, useState, useRef, useEffect } from 'react';
import './App.css';


function App() {

  const [questions, setQuestions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
useEffect(()=>{
  const fetchQuestions = async()=>{
    try{
    const response = await fetch('http://localhost:5168/api/questions?count=10');
    const data = await response.json();

    console.log("Raw data from backend:", data);
    const questionsString = data.map((q:any) =>q.questionText);
    const answers = data.map((q:any) => q.answer);

    setQuestions(questionsString);
    setCorrectAnswers(answers);

    console.log("Questions:", questionsString);
    console.log("Answers:", answers);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
};
fetchQuestions();
}, []);


const handleSubmit = (e: { preventDefault: () => void; }) => {
  e.preventDefault();
  const correctResult = (parseInt(userAnswer) === correctAnswers[currentQuestionIndex]);
    setResult(correctResult? "correct": "incorrect")   
    setScore(correctResult? score + 1: score)
  setFeedback(true);
  setTimeout(()=>{
    setUserAnswer("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(questions.length);
    }
    setFeedback(false);
    },500)
  if (inputRef.current) {
    inputRef.current.focus();
  }
};

const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
  setUserAnswer(e.target.value);
  setFeedback(false);
};



return (
  <div>
    {currentQuestionIndex < questions.length ? (     
    <div className="title">Multiplication Quiz
      <div className="question-container">
        <div className='question-box'>
          <form onSubmit={handleSubmit}>
            <label >
              {questions[currentQuestionIndex]} =
            </label>
            <input className='user-answer'
              type="number"
              value={userAnswer}
              onChange={handleInputChange}
              ref={inputRef}
              autoFocus />
          </form>
          {feedback && (
            <div className="answer-feedback">
              <span className={result === "correct" ? 'correct' : 'incorrect'}>
                {result === "correct" ? '✓' : (
                  <>
                    <span>✗</span>
                     <span className='correct-answer'>Answer is: {correctAnswers[currentQuestionIndex]}</span>
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
          <div>
            {currentQuestionIndex != 0 && (
              <p className="score">
                Score = {score}/{currentQuestionIndex}
              </p>
            )}
          </div>
    </div>
      
    ) : (
        <div className="end-quiz-text" > Quiz completed! 
        <p className='final-score'>Your final Score is : {score}/{questions.length}</p>
        <div>
          <button 
            onClick={()=>window.location.reload()}>
            Try again
            </button>
           </div>
        </div>
      )}
    </div>  
  
);
}

export default App;
