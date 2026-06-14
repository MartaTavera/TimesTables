using Microsoft.AspNetCore.Mvc;
using TimetablesAPI.Models;
using TimetablesAPI.Services;
using TimetablesAPI.Data;
using Microsoft.AspNetCore.Authorization;

namespace TimetablesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly QuestionsGeneratorService _questionGenerator;
        private readonly TimestablesDbContext _context; 
        private readonly ScoreCalculatorService _scoreCalculator;

        public QuestionsController(QuestionsGeneratorService questionGenerator, TimestablesDbContext context, ScoreCalculatorService scoreCalculator)

        {
            _questionGenerator = questionGenerator;
            _context = context;
            _scoreCalculator = scoreCalculator;
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
        [Authorize]
        [HttpPost("submit")]
        public async Task<ActionResult<QuizResult>> SubmitAnswers([FromBody] List<UserAnswer> userAnswers)
        {
            
             var (correctCount,results) = _scoreCalculator.Calculate(userAnswers);
            
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var quizResult = new QuizResult {
                TotalQuestions = userAnswers.Count,
                CorrectAnswers = correctCount,
                Score = (int)((correctCount / (double)userAnswers.Count) * 100),
                Results = results,
                DateTaken= DateTime.UtcNow,
                UserId = userId
            };
            _context.QuizResult.Add(quizResult);
            await _context.SaveChangesAsync();


            return Ok(quizResult);
        }
    }
}
