using Microsoft.EntityFrameworkCore;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Repositorios
{
    public class DepartamentoRepository : IDepartamentoRepository
    {
        private readonly ViajeTourContext _context;

        public DepartamentoRepository(ViajeTourContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Departamento>> ObtenerTodosAsync()
        {
            // Accede al DbSet y devuelve la lista completa
            return await _context.Departamento.ToListAsync();
        }
    }
}
