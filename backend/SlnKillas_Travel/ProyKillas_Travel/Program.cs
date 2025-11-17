using KillasTravel.Application.Interfaces;
using KillasTravel.Application.Mappings;
using KillasTravel.Infrastructure.BD;
using KillasTravel.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;



var builder = WebApplication.CreateBuilder(args);

// --- CONFIGURACIÓN DE LA CONEXIÓN DE BASE DE DATOS (EF Core) ---
builder.Services.AddDbContext<KillasTravelDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("cn1"))
);

// Registra IDestinoRepository con su implementación DestinoRepository
builder.Services.AddScoped<IDestinoRepository, DestinoRepository>();
builder.Services.AddScoped<IAlojamientoRepository, AlojamientoRepository>();
builder.Services.AddScoped<ITransporteRepository, TransporteRepository>();
builder.Services.AddScoped<ITourRepository, TourRepository>();



builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
// Servicios para Controladores y API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// 2. Configuración del Pipeline de Solicitudes (app)

var app = builder.Build();

// Configuración del HTTP request pipeline (Swagger solo en desarrollo)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();