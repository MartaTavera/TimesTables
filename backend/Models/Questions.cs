namespace TimetablesAPI.Models
{
    public class Question
    {
        public int Number1 { get; set; }
        public int Number2 { get; set; }
        public string Operation { get; set; } = "×";
        public int Answer { get; set; }
        public string QuestionText { get; set; } = "";
    }
}