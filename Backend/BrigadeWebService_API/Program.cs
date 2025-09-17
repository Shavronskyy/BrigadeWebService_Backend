using BrigadeWebService_BLL.Mapper.Vacancies;
using BrigadeWebService_BLL.Options;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations;
using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Repositories.Interfaces.Donations;
using BrigadeWebService_DAL.Repositories.Interfaces.Reports;
using BrigadeWebService_DAL.Repositories.Interfaces.Vacancies;
using BrigadeWebService_DAL.Repositories.Realizations.Donations;
using BrigadeWebService_DAL.Repositories.Realizations.Vacancies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Scan a specific assembly that contains your Profiles
builder.Services.AddAutoMapper(typeof(VacancyProfile));

// 1) DbContext
var stri = builder.Configuration.GetConnectionString("DefaultConnection");
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

// services (existing)
builder.Services.AddTransient<IVacanciesService, VacanciesService>();
builder.Services.AddTransient<IReportsService, ReportsService>();
builder.Services.AddTransient<IDonationService, DonationService>();

// Repository (existing)
builder.Services.AddScoped<IVacancyRepository, VacancyRepository>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddScoped<IDonationsRepository, DonationsRepository>();

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

// NEW: Upload options (uploads to wwwroot/uploads/…)
builder.Services.Configure<UploadOptions>(builder.Configuration.GetSection("Uploads"));

var app = builder.Build();

app.UseCors("AllowReactApp");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

// NEW: make sure wwwroot exists
var webRoot = app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
Directory.CreateDirectory(webRoot);

app.Run();
