import { SetStateAction, useState, useRef, useEffect } from 'react';
import './App.css';


function App() {

  interface QuestionData {
    number1: number;
    number2: number;
    questionText: string;
    answer: number;
  }

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [userAnswersSet, setUserAnswersSet] = useState<any[]>([]);
  const [result, setResult] = useState("");
  const [quizResults, setQuizResults] = useState<any>(null);
  const [questionCount, setQuestionCount] = useState(20);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:5168/api/questions?count=${questionCount}`);
        const data = await response.json();
        const questionsString = data.map((q: any) => q.questionText);
        const answers = data.map((q: any) => q.answer);

        setQuestions(data);
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
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswerNum = parseInt(userAnswer);
    const updatedAnswers =([...userAnswersSet, {
      Number1: currentQuestion.number1,
      Number2: currentQuestion.number2,
      UAnswer: userAnswerNum
    }]);
    setUserAnswersSet(updatedAnswers);
    const correctResult = (parseInt(userAnswer) === correctAnswers[currentQuestionIndex]);
    setResult(correctResult ? "correct" : "incorrect")
    setScore(correctResult ? score + 1 : score)
    setFeedback(true);
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    if (isLastQuestion) {
      // Submit immediately with the updated answers
      submitBatch(updatedAnswers);
    }
    setTimeout(() => {
      setUserAnswer("");
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentQuestionIndex(questions.length);
      }
      setFeedback(false);
    }, 500)
  
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const submitBatch = async (answers: any[]) => {
    console.log("Sending this data:", JSON.stringify(answers, null, 2));
    try {
      const response = await fetch('http://localhost:5168/api/Questions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      console.log("Response status:", response.status);
      if (!response.ok) {
        console.error("Response not OK:", await response.text());
        return;
      }
      const quizData = await response.json();
      setQuizResults(quizData);
      console.log("Quiz data received:", quizData); 
      } catch (error) {
      console.error("Error fetching quizData:", error);
    }
  };
  const restartWithNewCount = async (count: number) => {
    setQuestionCount(count);
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswer("");
    setUserAnswersSet([]);
    setQuizResults(null);
    
    try {
      const response = await fetch(`http://localhost:5168/api/questions?count=${count}`);
      const data = await response.json();
      const answers = data.map((q: any) => q.answer);
      setQuestions(data);
      setCorrectAnswers(answers);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setUserAnswer(e.target.value);
    setFeedback(false);
  };


  return (
    <div>
      {currentQuestionIndex < questions.length ? (
        <div className="title"> Multiplication 
        <div className="question-count-selector">
          <span style={{fontSize: '0.55em'}}> Select number of questions: </span>
          <div className="button-group">
          <button className="question-button" onClick={() => restartWithNewCount(20)}>20</button>
          <button className="question-button" onClick={() => restartWithNewCount(30)}>30</button>
          <button className="question-button" onClick={() => restartWithNewCount(40)}>40</button>
          <button className="question-button" onClick={() => restartWithNewCount(50)}>50</button>
        </div>
        </div>
          <div className="question-container">
            <div className='question-box'>
              <form onSubmit={handleSubmit}>
                <label >
                  {questions[currentQuestionIndex].questionText} =
                </label>
                <input className='user-answer'
                  type="number"
                  onChange={handleInputChange}
                  ref={inputRef}
                  autoFocus
                  required 
                  value={userAnswer} />
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
          {quizResults && quizResults.results && (
            <div>
              <p className="score-line"> {quizResults.score}% </p>
              {quizResults.score !== 100 && (
                <>
                <p>Review:</p>
                <div className='summary-answers-grid'>  
                  {quizResults.results
                  .filter((r: any) => !r.isCorrect)
                  .map((respuesta: any, index: number) => (
                    <div key={index}  className = "incorrect-answers">
                      {respuesta.number1} x {respuesta.number2} = {respuesta.correctAnswer}
                      <div><span style={{fontSize: '0.65em'}}>Your answer :</span> {respuesta.userAnswer}</div>
                      
                    </div>
                    ))
                  }
                </div>
                </>
              )}      
            </div>
          )}
          <div>
            <button
              onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
