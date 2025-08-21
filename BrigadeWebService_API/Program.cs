using BrigadeWebService_BLL.Mapper.Vacancies;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations;
using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Repositories.Interfaces.Vacancies;
using BrigadeWebService_DAL.Repositories.Realizations.Vacancies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;


var builder = WebApplication.CreateBuilder(args);

// Scan a specific assembly that contains your Profiles
builder.Services.AddAutoMapper(typeof(VacancyProfile));

// 1) DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sql => sql.MigrationsAssembly("BrigadeWebService_DAL")
    ));

// 2) JWT
var jwtConfig = builder.Configuration.GetSection("Jwt");
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig["Key"]!));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtConfig["Issuer"],
            ValidAudience = jwtConfig["Audience"],
            IssuerSigningKey = key,
            ClockSkew = TimeSpan.Zero
        };
    });

// 3) Services
builder.Services.AddScoped<ITokenService, TokenService>();

// 4) CORS
// 4) CORS - Most permissive for testing
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.SetIsOriginAllowed(origin => true)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 5) Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// services
builder.Services.AddTransient<IVacanciesService, VacanciesService>();

// Repository
builder.Services.AddScoped<IVacancyRepository, VacancyRepository>();

var app = builder.Build();

app.UseCors("AllowReactApp"); // CORS must come FIRST
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();