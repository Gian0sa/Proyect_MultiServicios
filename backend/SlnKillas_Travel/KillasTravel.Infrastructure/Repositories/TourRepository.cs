using KillasTravel.Application.Interfaces;
using KillasTravel.Domain.Entities;
using KillasTravel.Infrastructure.BD;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KillasTravel.Infrastructure.Repositories
{
    public class TourRepository : ITourRepository
    {
        private readonly KillasTravelDbContext _context;

        public TourRepository(KillasTravelDbContext context)
        {
            _context = context;
        }

        // C - Implementación de Crear
        public async Task<Tour> AddAsync(Tour tour)
        {
            await _context.Tours.AddAsync(tour);
            await _context.SaveChangesAsync();
            return tour;
        }

        // R - Implementación de Leer por ID (Incluye el Destino asociado)
        public async Task<Tour?> GetByIdAsync(int id)
        {
            return await _context.Tours
                                 .Include(t => t.Destino) // Agregamos la información del Destino
                                 .FirstOrDefaultAsync(t => t.TourID == id);
        }

        // R - Implementación de Leer Todos (Incluye el Destino asociado)
        public async Task<IEnumerable<Tour>> GetAllAsync()
        {
            return await _context.Tours
                                 .Include(t => t.Destino)
                                 .ToListAsync();
        }

        // U - Implementación de Actualizar
        public async Task UpdateAsync(Tour tour)
        {
            _context.Entry(tour).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        // D - Implementación de Eliminar
        public async Task DeleteAsync(int id)
        {
            var tour = await _context.Tours.FindAsync(id);
            if (tour != null)
            {
                _context.Tours.Remove(tour);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Tour>> GetByRegionIdAsync(int regionId)
        {
            return await _context.Tours
                // Incluimos el Destino para acceder a la FK de Región
                .Include(t => t.Destino)
                // Filtramos donde el Destino esté asociado al RegionID
                .Where(t => t.Destino != null && t.Destino.RegionID == regionId)
                .ToListAsync();
        }
        public async Task<IEnumerable<Tour>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice)
        {
            // Filtra directamente sobre la columna 'Precio' de la tabla Tours
            return await _context.Tours
                .Where(t => t.Precio >= minPrice && t.Precio <= maxPrice)
                .ToListAsync();
        }
    }
}