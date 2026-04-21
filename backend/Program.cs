using TimetablesAPI.Services;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<QuestionsGeneratorService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {

      policy.WithOrigins(
    "http://localhost:5173",      // For when YOU develop locally
    "http://localhost:5174",      // Backup local port
    "https://martatavera.github.io"  // For production (GitHub Pages)
)

    .AllowAnyHeader()
    .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();  // Render handles HTTPS at proxy level
app.UseCors("AllowFrontend");
app.MapControllers();

app.Run();