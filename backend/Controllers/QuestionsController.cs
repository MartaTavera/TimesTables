using Microsoft.AspNetCore.Mvc;
using TimetablesAPI.Models;
using TimetablesAPI.Services;

namespace TimetablesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly QuestionsGeneratorService _questionGenerator;

        public QuestionsController(QuestionsGeneratorService questionGenerator)
        {
            _questionGenerator = questionGenerator;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Question>> GetQuestions(
            [FromQuery] int count = 10,
            [FromQuery] int min = 2,
            [FromQuery] int max = 12,
            [FromQuery] string operation = "both")
        {
            var questions = _questionGenerator.GenerateBatch(count, min, max, operation);
            return Ok(questions);
        }

        [HttpPost("submit")]
        public ActionResult<QuizResult> SubmitAnswers([FromBody] List<UserAnswer> userAnswers)
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

            return Ok(new QuizResult
            {
                TotalQuestions = userAnswers.Count,
                CorrectAnswers = correctCount,
                Score = (int)((correctCount / (double)userAnswers.Count) * 100),
                Results = results
            });
        }
    }
}
