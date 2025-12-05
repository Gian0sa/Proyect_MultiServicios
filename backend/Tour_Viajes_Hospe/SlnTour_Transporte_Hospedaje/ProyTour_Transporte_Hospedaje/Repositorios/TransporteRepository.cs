using Microsoft.EntityFrameworkCore;
using ProyTour_Transporte_Hospedaje.Dtos.TransporteDto;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Repositorios
{
    public class TransporteRepository : ITransporteRepository
    {
        private readonly ViajeTourContext _context;

        public TransporteRepository(ViajeTourContext context)
        {
            _context = context;
        }

        // ================== CREATE ==================
        public async Task CrearTransporteAsync(Servicio servicio, Transporte transporte)
        {
            await _context.Servicio.AddAsync(servicio);
            transporte.IdServicioNavigation = servicio;
            await _context.Transporte.AddAsync(transporte);
        }

        // ================== READ (Modelo Completo) ==================
        public async Task<Transporte?> ObtenerPorIdAsync(int idTransporte)
        {
            return await _context.Transporte
                .Include(t => t.IdServicioNavigation)
                .Include(t => t.IdOrigenNavigation) // Carga Destino Origen
                    .ThenInclude(d => d.IdDepartamentoNavigation)
                .Include(t => t.IdDestinoNavigation) // Carga Destino Final
                    .ThenInclude(d => d.IdDepartamentoNavigation)
                .FirstOrDefaultAsync(t => t.IdTransporte == idTransporte);
        }

        // ================== READ (Proyección DTO) ==================
        public async Task<IEnumerable<TransporteReadDto>> ObtenerTodosDtoAsync()
        {
            return await _context.Transporte
                .Select(t => new TransporteReadDto
                {
                    IdServicio = t.IdServicio,
                    IdTransporte = t.IdTransporte,

                    // Mapeo de Servicio
                    Nombre = t.IdServicioNavigation.Nombre,
                    Descripcion = t.IdServicioNavigation.Descripcion,
                    PrecioBase = t.IdServicioNavigation.PrecioBase,

                    // Mapeo de Transporte
                    Categoria = t.Categoria,
                    FechaSalida = t.FechaSalida,
                    FechaLlegada = t.FechaLlegada,

                    // Mapeo de Relaciones (Destino Origen y Destino Final)
                    IdOrigen = t.IdOrigen,
                    NombreOrigen = t.IdOrigenNavigation.NombreDestino,
                    NombreDepartamentoOrigen = t.IdOrigenNavigation.IdDepartamentoNavigation.NombreDepartamento,

                    IdDestino = t.IdDestino,
                    NombreDestino = t.IdDestinoNavigation.NombreDestino,
                    NombreDepartamentoDestino = t.IdDestinoNavigation.IdDepartamentoNavigation.NombreDepartamento
                })
                .ToListAsync();
        }

        // ================== UPDATE ==================
        public void Actualizar(Servicio servicio, Transporte transporte)
        {
            _context.Servicio.Update(servicio);
            _context.Transporte.Update(transporte);
        }

        // ================== DELETE ==================
        public void Eliminar(Servicio servicio, Transporte transporte)
        {
            _context.Transporte.Remove(transporte);
            _context.Servicio.Remove(servicio);
        }

        // ================== SAVE ==================
        public async Task<bool> GuardarCambiosAsync()
        {
            return (await _context.SaveChangesAsync() >= 0);
        }
    }
}
