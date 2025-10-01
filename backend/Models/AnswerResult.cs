namespace TimetablesAPI.Models
{
    public class AnswerFeedback
    {
        public int Number1 { get; set; }
        public int Number2 { get; set; }
        public int UserAnswer { get; set; }
        public int CorrectAnswer { get; set; }
        public bool IsCorrect { get; set; }
    }
}
