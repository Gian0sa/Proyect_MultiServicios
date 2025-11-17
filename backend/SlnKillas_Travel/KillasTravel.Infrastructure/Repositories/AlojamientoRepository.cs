using KillasTravel.Application.Interfaces;
using KillasTravel.Domain.Entities;
using KillasTravel.Infrastructure.BD;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KillasTravel.Infrastructure.Repositories
{
    public class AlojamientoRepository : IAlojamientoRepository
    {
        private readonly KillasTravelDbContext _context;

        // Inyección del DbContext para acceder a la BD
        public AlojamientoRepository(KillasTravelDbContext context)
        {
            _context = context;
        }

        // C - Implementación de Crear Alojamiento
        public async Task<Alojamiento> AddAsync(Alojamiento alojamiento)
        {
            await _context.Alojamientos.AddAsync(alojamiento);
            await _context.SaveChangesAsync();
            return alojamiento;
        }

        // R - Implementación de Leer por ID
        public async Task<Alojamiento?> GetByIdAsync(int id)
        {
            return await _context.Alojamientos.FindAsync(id);
        }

        // R - Implementación de Leer Todos
        public async Task<IEnumerable<Alojamiento>> GetAllAsync()
        {
            return await _context.Alojamientos.ToListAsync();
        }

        // U - Implementación de Actualizar
        public async Task UpdateAsync(Alojamiento alojamiento)
        {
            // Adjuntar la entidad y marcarla como modificada para que EF Core la actualice
            _context.Entry(alojamiento).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        // D - Implementación de Eliminar
        public async Task DeleteAsync(int id)
        {
            var alojamiento = await _context.Alojamientos.FindAsync(id);
            if (alojamiento != null)
            {
                _context.Alojamientos.Remove(alojamiento);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Alojamiento>> GetByRegionIdAsync(int regionId)
        {
            return await _context.Alojamientos
                // Primero incluimos el Destino (que tiene la FK a Region)
                .Include(a => a.Destino)
                // Filtramos en la propiedad de navegación hasta llegar al RegionID
                .Where(a => a.Destino != null && a.Destino.RegionID == regionId)
                .ToListAsync();
        }
        public async Task<IEnumerable<Alojamiento>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice)
        {
            return await _context.Alojamientos
                // Filtramos por la columna PrecioPorNoche
                .Where(a => a.PrecioPorNoche >= minPrice && a.PrecioPorNoche <= maxPrice)
                .ToListAsync();
        }
    }
}