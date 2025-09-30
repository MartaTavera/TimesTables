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
            [FromQuery] int max = 12)
        {
            var questions = _questionGenerator.GenerateBatch(count, min, max);
            return Ok(questions);
        }
    }
}