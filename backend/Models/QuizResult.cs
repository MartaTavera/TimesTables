namespace TimetablesAPI.Models
{
    public class QuizResult
    {
        public int Id { get; set; } 
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public int Score { get; set; }
        public DateTime DateTaken { get; set; }
        public string? UserId { get; set; }
        public List<AnswerResult> Results { get; set; } = new();
    }
}