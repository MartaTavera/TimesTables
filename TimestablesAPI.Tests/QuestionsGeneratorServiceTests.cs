using TimetablesAPI.Models;
using TimetablesAPI.Services;


namespace TimestablesAPI.Tests;

public class QuestionsGeneratorServiceTests
{
    
    private readonly QuestionsGeneratorService _sut = new();

    [Fact]
        public void GenerateBatch_DivisionOperation_AllAnswersAreWholeNumbers()
        {
            // Arrange
            var count = 20;
            // Act
            var questions = _sut.GenerateBatch(count: count, operation: "÷");

            // Assert
            Assert.All(questions, q =>
            {
                Assert.Equal("÷", q.Operation);
                Assert.Equal(0, q.Number1 % q.Number2);   // no remainder
                Assert.Equal(q.Number1 / q.Number2, q.Answer); // answer is correct
            });
        }
        [Fact]
         public void GenerateBatch_MultiplicationOperation_AllAnswersAreCorrect()
        {
            var questions = _sut.GenerateBatch(count: 20, operation: "×");
            Assert.All(questions, q =>
            {
            Assert.Equal("×", q.Operation);
            Assert.Equal(q.Number1 * q.Number2, q.Answer);
            });
        }
    [Theory]
    [InlineData(5)]
    [InlineData(10)]
    [InlineData(20)]    
        public void GenerateBatch_ReturnsExactRequestedCount(int count)
        {
            var questions = _sut.GenerateBatch(count: count);
            Assert.Equal(count, questions.Count);
        }
        [Fact]
        public void GenerateBatch_BothOperation_OnlyContainsMultiplicationAndDivision()
        {
            var questions = _sut.GenerateBatch(count: 20, operation: "both");
            Assert.All(questions, q =>
            Assert.Contains(q.Operation, new[] { "×", "÷" })
            );
        }
}