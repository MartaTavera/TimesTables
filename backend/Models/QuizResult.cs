namespace TimetablesAPI.Models
{
    public class QuizResult
    {
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public string UserAnswer { get; set; }
        public int Score { get; set; }
        public List<AnswerResult> Results { get; set; } = new();
    }
}