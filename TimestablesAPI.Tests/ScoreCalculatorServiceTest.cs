using TimetablesAPI.Models;
using TimetablesAPI.Services;
using TimetablesAPI.Data;

namespace TimestablesAPI.Tests;

public class ScoreCalculatorServiceTest
{
    
    private readonly ScoreCalculatorService _sut = new();


        //Arrange, Act, Assert, 
    [Fact]
    public void ScoreCalculator_CorrectAnswerMarkedCorrect() 
    {
      
        var userAnswers = new List<UserAnswer>
        {
            new UserAnswer { Number1 = 3, Number2 = 4, Operation = "×", UAnswer = 12 }
        };

        var (correctCount, results) = _sut.Calculate(userAnswers);

        Assert.Equal(1, correctCount);
        Assert.True(results[0].IsCorrect);

    }
    [Fact]
     public void ScoreCalculator_IncorrectAnswerMarkedInorrect() 
    {
      
        var userAnswers = new List<UserAnswer>
        {
            new UserAnswer { Number1 = 3, Number2 = 4, Operation = "×", UAnswer = 10 }
        };

        var (correctCount, results) = _sut.Calculate(userAnswers);

        Assert.Equal(0, correctCount);
        Assert.False(results[0].IsCorrect);

    }

    [Fact]
     public void ScoreCalculator_CorrectDivisionAnswerMarkedCorrect() 
    {
      
        var userAnswers = new List<UserAnswer>
        {
            new UserAnswer { Number1 = 20, Number2 = 4, Operation = "÷", UAnswer = 5 }
        };

        var (correctCount, results) = _sut.Calculate(userAnswers);

        Assert.Equal(1, correctCount);
        Assert.True(results[0].IsCorrect);

    }

     [Fact]
     public void ScoreCalculator_IncorrectDivisionAnswerMarkedInorrect() 
    {
        var userAnswers = new List<UserAnswer>
        {
            new UserAnswer { Number1 = 20, Number2 = 5, Operation = "÷", UAnswer = 10 },
           
        };

        var (correctCount, results) = _sut.Calculate(userAnswers);

        Assert.Equal(0, correctCount);
        Assert.False(results[0].IsCorrect);

    }

     [Fact]
     public void ScoreCalculator_CorrectCount()
     {
        var userAnswers = new List<UserAnswer>
        {
            new UserAnswer { Number1 = 20, Number2 = 5, Operation = "÷", UAnswer = 4 },
            new UserAnswer { Number1 = 25, Number2 = 5, Operation = "÷", UAnswer = 12 },
            new UserAnswer { Number1 = 3, Number2 = 4, Operation = "×", UAnswer = 12 }
        };

        var (correctCount, results) = _sut.Calculate(userAnswers);
        Assert.Equal(2, correctCount);
        Assert.True(results[0].IsCorrect);
        Assert.False(results[1].IsCorrect);
        Assert.True(results[2].IsCorrect);
     }

     [Fact]
     public void ScoreCalculator_CorrectAnswerPopulatedCorreclty()
     {
        var userAnswers = new List<UserAnswer>
        {
            new UserAnswer { Number1 = 20, Number2 = 5, Operation = "÷", UAnswer = 4 },
            new UserAnswer { Number1 = 25, Number2 = 5, Operation = "÷", UAnswer = 12 },
            new UserAnswer { Number1 = 3, Number2 = 4, Operation = "×", UAnswer = 12 }
        };
        var (correctCount, results) = _sut.Calculate(userAnswers);
        Assert.Equal(5,results[1].CorrectAnswer);

     }
}