import { SetStateAction, useState, useRef, useEffect } from 'react';
import './App.css';

// Utility function to determine medal tier
const getMedalTier = (score: number, total: number) => {
  const percentage = (score / total) * 100;
  
  if (percentage === 100) {
    return { tier: 'goldcup', percentage: 100, label: 'Perfect Score!' };
  } else if (percentage >= 90) {
    return { tier: 'gold', percentage: Math.round(percentage), label: 'Gold Medal' };
  } else if (percentage >= 80) {
    return { tier: 'silver', percentage: Math.round(percentage), label: 'Silver Medal' };
  } else if (percentage >= 70) {
    return { tier: 'bronze', percentage: Math.round(percentage), label: 'Bronze Medal' };
  } else {
    return { tier: 'none', percentage: Math.round(percentage), label: 'Keep Practicing!' };
  }
};

// Medal display component
const MedalDisplay = ({ medal }: { medal: ReturnType<typeof getMedalTier> }) => {
  return (
    <div className="medal-container">
      <div className={`medal ${medal.tier}`}>
        {medal.tier === 'goldcup' && '🏆'}
        {medal.tier === 'gold' && '🥇'}
        {medal.tier === 'silver' && '🥈'}
        {medal.tier === 'bronze' && '🥉'}
      </div>
      <p className="medal-label">{medal.label}</p>
    </div>
  );
};

function App() {

  interface QuestionData {
    number1: number;
    number2: number;
    operation: string;
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
  const [questionCount, setQuestionCount] = useState(10);
  const [operationType, setOperationType] = useState("both");
  const inputRef = useRef<HTMLInputElement>(null);
  
  console.log("Current questionCount:", questionCount);
  console.log("Current operationType:", operationType);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`https://timestables-bwbqcvevgaf5fsdp.canadacentral-01.azurewebsites.net/api/questions?count=${questionCount}&operation=${operationType}`);

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
    const updatedAnswers = ([...userAnswersSet, {
      Number1: currentQuestion.number1,
      Number2: currentQuestion.number2,
      Operation: currentQuestion.operation,
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
      const response = await fetch('https://timestables-bwbqcvevgaf5fsdp.canadacentral-01.azurewebsites.net/api/Questions/submit', {
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

  const restartQuiz = async (count: number, operation: string) => {
    setQuestionCount(count);
    setOperationType(operation);
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswer("");
    setUserAnswersSet([]);
    setQuizResults(null);

    try {
      const response = await fetch(`https://timestables-bwbqcvevgaf5fsdp.canadacentral-01.azurewebsites.net/api/questions?count=${count}&operation=${operation}`);
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

  const medal = getMedalTier(score, questions.length);

  return (
    <div>
      {currentQuestionIndex < questions.length ? (
        <>   
          <div className="selectors-container">
            <div className="question-count-selector">
              <span style={{ fontSize: '1.1em' }}> Select number of questions: </span>
              <div className="button-group">
                <button className={`question-button ${questionCount === 20 ? 'selected' : ''}`} onClick={() => restartQuiz(20, operationType)}>20</button>
                <button className={`question-button ${questionCount === 30 ? 'selected' : ''}`} onClick={() => restartQuiz(30, operationType)}>30</button>
                <button className={`question-button ${questionCount === 40 ? 'selected' : ''}`} onClick={() => restartQuiz(40, operationType)}>40</button>
                <button className={`question-button ${questionCount === 50 ? 'selected' : ''}`} onClick={() => restartQuiz(50, operationType)}>50</button>
                <button className={`question-button ${questionCount === 60 ? 'selected' : ''}`} onClick={() => restartQuiz(60, operationType)}>60</button>
              </div>
            </div>

            <div className="operation-selector">
              <span style={{ fontSize: '1.1em' }}> Select operation: </span>
              <div className="button-group">
                <button className={`operation-button ${operationType === '×' ? 'selected' : ''}`} onClick={() => restartQuiz(questionCount, '×')}> ×</button>
                <button className={`operation-button ${operationType === '÷' ? 'selected' : ''}`} onClick={() => restartQuiz(questionCount, '÷')}> ÷</button>
                <button className={`operation-button ${operationType === 'both' ? 'selected' : ''}`} onClick={() => restartQuiz(questionCount, 'both')}>Both</button>
              </div>
            </div>
          </div>

          <div className="title"> Multiplication Quiz
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
        </>
      ) : (
        <div className="end-quiz-text" > Quiz completed!
          <p className='final-score'>Your final Score is : {score}/{questions.length}</p>
          
          {medal.tier !== 'none' && <MedalDisplay medal={medal} />}
          {medal.tier === 'none' && <p className="keep-practicing">{medal.label}</p>}
          
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
                        <div key={index} className="incorrect-answers">
                          {respuesta.number1} {respuesta.operation} {respuesta.number2} = {respuesta.correctAnswer}
                          <div><span style={{ fontSize: '0.65em' }}>Your answer :</span> {respuesta.userAnswer}</div>
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