using TimetablesAPI.Models;

namespace TimetablesAPI.Services
{
    public class QuestionsGeneratorService
    {
        private readonly Random _random = new Random();

        public List<Question> GenerateBatch(int count = 10, int minNumber = 2, int maxNumber = 12, string operation = "both")
        {
            var questions = new List<Question>();
            var usedPairs = new HashSet<string>();

            while (questions.Count < count)
            {
                Question question = operation switch
                {
                    "×" => GenerateMultiplicationQuestion(minNumber, maxNumber, usedPairs),
                    "÷" => GenerateDivisionQuestion(minNumber, maxNumber, usedPairs),
                    "both" => _random.Next(2) == 0 
                        ? GenerateMultiplicationQuestion(minNumber, maxNumber, usedPairs)
                        : GenerateDivisionQuestion(minNumber, maxNumber, usedPairs),
                    _ => GenerateMultiplicationQuestion(minNumber, maxNumber, usedPairs)
                };

                questions.Add(question);
            }

            return questions;
        }

        private Question GenerateMultiplicationQuestion(int minNumber, int maxNumber, HashSet<string> usedPairs)
        {
            string orderedPair;
            int num1, num2;

            do
            {
                num1 = _random.Next(minNumber, maxNumber + 1);
                num2 = _random.Next(minNumber, maxNumber + 1);
                orderedPair = GetOrderedPair(num1, num2);
            } while (usedPairs.Contains(orderedPair));

            usedPairs.Add(orderedPair);

            return new Question
            {
                Number1 = num1,
                Number2 = num2,
                Operation = "×",
                Answer = num1 * num2,
                QuestionText = $"{num1} × {num2}"
            };
        }

        private Question GenerateDivisionQuestion(int minNumber, int maxNumber, HashSet<string> usedPairs)
        {
            string orderedPair;
            int result, divisor, dividend;

            do
            {
                // Generate a result (1 to maxNumber)
                result = _random.Next(1, maxNumber + 1);
                // Generate a divisor (minNumber to maxNumber)
                divisor = _random.Next(minNumber, maxNumber + 1);
                // Calculate dividend: result * divisor
                dividend = result * divisor;
                // Biggest number first: dividend ÷ divisor
                orderedPair = $"{dividend}-{divisor}";
            } while (usedPairs.Contains(orderedPair));

            usedPairs.Add(orderedPair);

            return new Question
            {
                Number1 = dividend,      // Biggest number first
                Number2 = divisor,
                Operation = "÷",
                Answer = result,
                QuestionText = $"{dividend} ÷ {divisor}"
            };
        }

        private string GetOrderedPair(int num1, int num2)
        {
            int min = Math.Min(num1, num2);
            int max = Math.Max(num1, num2);
            return $"{min}-{max}";
        }
    }
}