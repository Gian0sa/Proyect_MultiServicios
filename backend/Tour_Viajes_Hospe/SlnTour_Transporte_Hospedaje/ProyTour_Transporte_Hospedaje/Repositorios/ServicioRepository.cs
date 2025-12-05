using Microsoft.EntityFrameworkCore;
using ProyTour_Transporte_Hospedaje.Dtos;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Repositorios
{
    public class ServicioRepository : IServicioRepository
    {
        private readonly ViajeTourContext _context;

        public ServicioRepository(ViajeTourContext context)
        {
            _context = context;
        }

        // ================== READ TODOS ==================
        public async Task<IEnumerable<ServicioReadDto>> ObtenerTodosDtoAsync()
        {
            return await _context.Servicio
                .Select(s => new ServicioReadDto
                {
                    IdServicio = s.IdServicio,
                    TipoServicio = s.TipoServicio,
                    Nombre = s.Nombre,
                    Descripcion = s.Descripcion,
                    PrecioBase = s.PrecioBase
                })
                .ToListAsync();
        }

        // ================== READ POR TIPO ==================
        public async Task<IEnumerable<ServicioReadDto>> ObtenerPorTipoDtoAsync(string tipo)
        {
            // Aseguramos que el tipo sea mayúsculas (como en la restricción de tu DB)
            string tipoUpper = tipo.ToUpper();

            return await _context.Servicio
                .Where(s => s.TipoServicio == tipoUpper)
                .Select(s => new ServicioReadDto
                {
                    IdServicio = s.IdServicio,
                    TipoServicio = s.TipoServicio,
                    Nombre = s.Nombre,
                    Descripcion = s.Descripcion,
                    PrecioBase = s.PrecioBase
                })
                .ToListAsync();
        }
    }
}
