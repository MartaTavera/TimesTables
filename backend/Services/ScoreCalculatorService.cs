using TimetablesAPI.Models;

namespace TimetablesAPI.Services
{
    public class ScoreCalculatorService
    {
        public (int correctCount, List<AnswerResult> results) Calculate(List<UserAnswer> userAnswers)
        {
            int correctCount = 0;
            var results = new List<AnswerResult>();

            foreach (var answer in userAnswers)
            {
                bool isCorrect = answer.Operation == "÷"
                    ? (answer.Number1 / answer.Number2) == answer.UAnswer
                    : (answer.Number1 * answer.Number2) == answer.UAnswer;

                int correctAnswer = answer.Operation == "÷"
                    ? answer.Number1 / answer.Number2
                    : answer.Number1 * answer.Number2;

                if (isCorrect) correctCount++;

                results.Add(new AnswerResult
                {
                    Number1 = answer.Number1,
                    Number2 = answer.Number2,
                    Operation = answer.Operation,
                    UserAnswer = answer.UAnswer,
                    CorrectAnswer = correctAnswer,
                    IsCorrect = isCorrect
                });
            }

            return (correctCount, results);
        }
    }
}