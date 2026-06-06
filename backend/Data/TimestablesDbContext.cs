using TimetablesAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace TimetablesAPI.Data
{
    public class TimestablesDbContext : DbContext
    {
        public TimestablesDbContext(DbContextOptions<TimestablesDbContext> options) : base(options)
{
}
        public DbSet<QuizResult> QuizResult { get; set;}
        public DbSet<AnswerResult> AnswerResult { get; set;}

    }
}