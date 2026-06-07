using TimetablesAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace TimetablesAPI.Data
{
    public class TimestablesDbContext : IdentityDbContext<ApplicationUser>
    {
        public TimestablesDbContext(DbContextOptions<TimestablesDbContext> options) : base(options)
{
}
        public DbSet<QuizResult> QuizResult { get; set;}
        public DbSet<AnswerResult> AnswerResult { get; set;}

    }
}