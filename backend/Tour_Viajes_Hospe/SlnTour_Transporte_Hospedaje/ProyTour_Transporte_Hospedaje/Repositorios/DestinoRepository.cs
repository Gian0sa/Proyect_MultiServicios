using Microsoft.EntityFrameworkCore;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Repositorios
{
    public class DestinoRepository : IDestinoRepository
    {
        private readonly ViajeTourContext _context;

        public DestinoRepository(ViajeTourContext context)
        {
            _context = context;
        }

        // READ: Obtener todos (incluimos el Departamento para mostrar la ubicación)
        public async Task<IEnumerable<Destino>> ObtenerTodosAsync()
        {
            // Usamos .Include() para cargar el objeto Departamento relacionado (Eager Loading)
            return await _context.Destino
                .Include(d => d.IdDepartamentoNavigation) // Nombre de la propiedad de navegación
                .ToListAsync();
        }

        // READ: Obtener por ID
        public async Task<Destino?> ObtenerPorIdAsync(int id)
        {
            return await _context.Destino
                .Include(d => d.IdDepartamentoNavigation)
                .FirstOrDefaultAsync(d => d.IdDestino == id);
        }

        // CREATE
        public async Task<Destino> CrearAsync(Destino destino)
        {
            await _context.Destino.AddAsync(destino);
            // Guardar cambios se llama en el controlador
            return destino;
        }

        // UPDATE: EF Core rastrea automáticamente los cambios si la entidad fue cargada
        public void Actualizar(Destino destino)
        {
            // EF Core marca la entidad como modificada
            _context.Destino.Update(destino);
        }

        // DELETE
        public void Eliminar(Destino destino)
        {
            _context.Destino.Remove(destino);
        }

        // GUARDAR CAMBIOS
        public async Task<bool> GuardarCambiosAsync()
        {
            // Retorna true si al menos una fila fue afectada
            return (await _context.SaveChangesAsync() >= 0);
        }
    }
}
