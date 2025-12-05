using Microsoft.EntityFrameworkCore;
using ProyTour_Transporte_Hospedaje.Dtos.TourDto;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Repositorios
{
    public class TourRepository : ITourRepository
    {
        private readonly ViajeTourContext _context;

        public TourRepository(ViajeTourContext context)
        {
            _context = context;
        }

        // ================== CREATE ==================
        public async Task CrearTourAsync(Servicio servicio, Tour tour)
        {
            await _context.Servicio.AddAsync(servicio);
            tour.IdServicioNavigation = servicio;
            await _context.Tour.AddAsync(tour);
        }

        // ================== READ (Modelo Completo) ==================
        public async Task<Tour?> ObtenerPorIdAsync(int idTour)
        {
            return await _context.Tour
                .Include(t => t.IdServicioNavigation)
                .Include(t => t.IdDestinoNavigation)
                    .ThenInclude(d => d.IdDepartamentoNavigation)
                .FirstOrDefaultAsync(t => t.IdTour == idTour);
        }

        // ================== READ (Proyección DTO) ==================
        public async Task<IEnumerable<TourReadDto>> ObtenerTodosDtoAsync()
        {
            return await _context.Tour
                .Select(t => new TourReadDto
                {
                    IdServicio = t.IdServicio,
                    IdTour = t.IdTour,

                    // Mapeo de Servicio
                    Nombre = t.IdServicioNavigation.Nombre,
                    Descripcion = t.IdServicioNavigation.Descripcion,
                    PrecioBase = t.IdServicioNavigation.PrecioBase,

                    // Mapeo de Tour
                    Duracion = t.Duracion,
                    GuiaIncluido = (bool)t.GuiaIncluido!, // El campo BIT/bool debe ser manejado si es nullable

                    // Mapeo de Relaciones
                    IdDestino = t.IdDestino,
                    NombreDestino = t.IdDestinoNavigation.NombreDestino,
                    NombreDepartamento = t.IdDestinoNavigation.IdDepartamentoNavigation.NombreDepartamento
                })
                .ToListAsync();
        }

        // ================== UPDATE ==================
        public void Actualizar(Servicio servicio, Tour tour)
        {
            _context.Servicio.Update(servicio);
            _context.Tour.Update(tour);
        }

        // ================== DELETE ==================
        public void Eliminar(Servicio servicio, Tour tour)
        {
            _context.Tour.Remove(tour);
            _context.Servicio.Remove(servicio);
        }

        // ================== SAVE ==================
        public async Task<bool> GuardarCambiosAsync()
        {
            return (await _context.SaveChangesAsync() >= 0);
        }
    }
}
