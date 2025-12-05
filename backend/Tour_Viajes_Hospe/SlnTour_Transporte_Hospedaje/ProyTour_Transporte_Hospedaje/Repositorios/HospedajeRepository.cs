using Microsoft.EntityFrameworkCore;
using ProyTour_Transporte_Hospedaje.Dtos.HospedajeDto;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Repositorios
{
    public class HospedajeRepository : IHospedajeRepository
    {
        private readonly ViajeTourContext _context;

        public HospedajeRepository(ViajeTourContext context)
        {
            _context = context;
        }

        // ================== CREATE ==================
        public async Task CrearHospedajeAsync(Servicio servicio, Hospedaje hospedaje)
        {
            // 1. Agregar el Servicio primero
            await _context.Servicio.AddAsync(servicio);

            // 2. Establecer la relación y agregar Hospedaje
            hospedaje.IdServicioNavigation = servicio; // Asignación en memoria
            await _context.Hospedaje.AddAsync(hospedaje);
        }

        // ================== READ (Modelo Completo) ==================
        public async Task<Hospedaje?> ObtenerPorIdAsync(int idHospedaje)
        {
            return await _context.Hospedaje
                .Include(h => h.IdServicioNavigation)  // Carga datos de Servicio
                .Include(h => h.IdDestinoNavigation)   // Carga datos de Destino
                    .ThenInclude(d => d.IdDepartamentoNavigation) // Carga datos de Departamento
                .FirstOrDefaultAsync(h => h.IdHospedaje == idHospedaje);
        }

        // ================== READ (Proyección DTO) ==================
        public async Task<IEnumerable<HospedajeReadDto>> ObtenerTodosDtoAsync()
        {
            // Usamos una consulta unificada (JOINs implícitos) y proyectamos a DTO
            return await _context.Hospedaje
                .Select(h => new HospedajeReadDto
                {
                    IdServicio = h.IdServicio,
                    IdHospedaje = h.IdHospedaje,

                    // Mapeo de Servicio
                    Nombre = h.IdServicioNavigation.Nombre,
                    Descripcion = h.IdServicioNavigation.Descripcion,
                    PrecioBase = h.IdServicioNavigation.PrecioBase,

                    // Mapeo de Hospedaje
                    RangoPrecio = h.RangoPrecio,
                    Capacidad = (int)h.Capacidad!, // Conversión segura
                    ServiciosIncluidos = h.ServiciosIncluidos,

                    // Mapeo de Relaciones (Destino y Departamento)
                    IdDestino = h.IdDestino,
                    NombreDestino = h.IdDestinoNavigation.NombreDestino,
                    NombreDepartamento = h.IdDestinoNavigation.IdDepartamentoNavigation.NombreDepartamento
                })
                .ToListAsync();
        }

        // ================== UPDATE ==================
        public void Actualizar(Servicio servicio, Hospedaje hospedaje)
        {
            // EF Core rastrea y marca ambas entidades como modificadas
            _context.Servicio.Update(servicio);
            _context.Hospedaje.Update(hospedaje);
        }

        // ================== DELETE ==================
        public void Eliminar(Servicio servicio, Hospedaje hospedaje)
        {
            // Se debe eliminar el Hospedaje detalle y luego el Servicio base
            _context.Hospedaje.Remove(hospedaje);
            _context.Servicio.Remove(servicio);
        }

        // ================== SAVE ==================
        public async Task<bool> GuardarCambiosAsync()
        {
            return (await _context.SaveChangesAsync() >= 0);
        }
    }
}
