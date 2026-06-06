namespace TimetablesAPI.Models
{
    public class AnswerResult
    {
        public int Id { get; set; } 
        public int QuizResultId { get; set; }
        public int Number1 { get; set; }
        public int Number2 { get; set; }
        public int UserAnswer { get; set; }
        public string Operation { get; set; } = "×";
        public int CorrectAnswer { get; set; }
        public bool IsCorrect { get; set; }
    }
}
