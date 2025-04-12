using TheBeaconCocktails.Model.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// <--- Denne linje tilføjer CORS tilladelse
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins("http://localhost:4200") // Tillad Angular frontend at kommunikere
              .AllowAnyMethod()
              .AllowAnyHeader());
});

// <--- Registrér LiquidIngredientRepository i DI-containeren
builder.Services.AddScoped<LiquidIngredientRepository>();

var app = builder.Build();

// Enable CORS
app.UseCors("AllowAngular");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// This line should be corrected:
app.UseHttpsRedirection(); // <-- This is the correct line!

app.UseAuthorization();
app.MapControllers();
app.Run();
