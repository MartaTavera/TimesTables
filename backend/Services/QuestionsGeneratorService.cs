using TimetablesAPI.Models;

namespace TimetablesAPI.Services
{
    public class QuestionsGeneratorService
    {
        private readonly Random _random = new Random();

        public List<Question> GenerateBatch(int count = 10, int minNumber = 2, int maxNumber = 12)
        {
            var questions = new List<Question>();
            var usedPairs = new HashSet<string>(); 

            while (questions.Count < count)
            {
                int num1 = _random.Next(minNumber, maxNumber + 1);
                int num2 = _random.Next(minNumber, maxNumber + 1);

                string orderedPair = GetOrderedPair(num1, num2);

                if (usedPairs.Contains(orderedPair))
                    continue;

                usedPairs.Add(orderedPair);

                questions.Add(new Question
                {
                    Number1 = num1,
                    Number2 = num2,
                    Operation = "&times",
                    Answer = num1 * num2,
                    QuestionText = $"{num1} × {num2}"
                });
            }

            return questions;
        }

        private string GetOrderedPair(int num1, int num2)
        {
            int min = Math.Min(num1, num2);
            int max = Math.Max(num1, num2);
            return $"{min}-{max}";
        }
    }
}