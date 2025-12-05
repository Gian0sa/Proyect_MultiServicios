using Microsoft.EntityFrameworkCore;
using ProyTour_Transporte_Hospedaje.Dtos.PaqueteDto;
using ProyTour_Transporte_Hospedaje.Dtos.PaqueteDto.Detalle;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Repositorios
{

    public class PaqueteRepository : IPaqueteRepository
    {
        private readonly ViajeTourContext _context;

        public PaqueteRepository(ViajeTourContext context)
        {
            _context = context;
        }

        // ================== READ TODOS (Proyección DTO) ==================
        public async Task<IEnumerable<PaqueteReadDto>> ObtenerTodosDtoAsync()
        {
            // Proyección para listado simple: solo cabecera, sin detalles de servicios para eficiencia.
            // Nota: Los DTOs PaqueteReadDto deben estar accesibles globalmente o importados correctamente.
            return await _context.Paquete
                .Select(p => new PaqueteReadDto
                {
                    // CORRECCIÓN: Usar p.IdPaquete (si tu modelo lo tiene) o p.PaqueteId (si EF Core lo infirió)
                    // Usamos la convención de EF Core: PaqueteId
                    IdPaquete = p.IdPaquete,
                    Nombre = p.Nombre,
                    Descripcion = p.Descripcion,
                    PrecioTotal = p.PrecioTotal,
                    EsPromocion = (bool)p.EsPromocion!,
                    // Detalles se cargan solo en ObtenerPorIdAsync, aquí se deja vacío.
                    Servicios = new List<PaqueteDetalleReadDto>()
                })
                .ToListAsync();
        }

        // ================== READ POR ID (Incluye detalles) ==================
        public async Task<Paquete?> ObtenerPorIdAsync(int idPaquete)
        {
            // Eager Loading: Carga el Paquete, sus PaqueteDetalles, y el Servicio asociado a cada detalle.
            return await _context.Paquete
                .Include(p => p.PaqueteDetalles)
                    .ThenInclude(pd => pd.IdServicioNavigation) // Carga el Servicio
                .FirstOrDefaultAsync(p => p.IdPaquete == idPaquete);
        }

        public async Task CrearPaqueteAsync(Paquete paquete)
        {
            await _context.Paquete.AddAsync(paquete);
        }

        public void Actualizar(Paquete paquete)
        {
            _context.Paquete.Update(paquete);
        }

        public void Eliminar(Paquete paquete)
        {
            _context.Paquete.Remove(paquete);
        }

        public async Task<bool> ExisteServicioAsync(int idServicio)
        {
            // CORRECCIÓN: Usar s.ServicioId
            return await _context.Servicio.AnyAsync(s => s.IdServicio == idServicio);
        }

        public async Task<bool> GuardarCambiosAsync()
        {
            return await _context.SaveChangesAsync() >= 0;
        }
    }
}
