using KillasTravel.Application.Interfaces;
using KillasTravel.Domain.Entities;
using KillasTravel.Infrastructure.BD;
using Microsoft.EntityFrameworkCore;

namespace KillasTravel.Infrastructure.Repositories
{
    public class TransporteRepository : ITransporteRepository
    {
        private readonly KillasTravelDbContext _context;

        public TransporteRepository(KillasTravelDbContext context)
        {
            _context = context;
        }

        // C - Implementación de Crear
        public async Task<Transporte> AddAsync(Transporte transporte)
        {
            await _context.Transportes.AddAsync(transporte);
            await _context.SaveChangesAsync();
            return transporte;
        }

        // R - Implementación de Leer por ID
        public async Task<Transporte?> GetByIdAsync(int id)
        {
            return await _context.Transportes.FindAsync(id);
        }

        // R - Implementación de Leer Todos
        public async Task<IEnumerable<Transporte>> GetAllAsync()
        {
            return await _context.Transportes.ToListAsync();
        }

        // U - Implementación de Actualizar
        public async Task UpdateAsync(Transporte transporte)
        {
            _context.Entry(transporte).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        // D - Implementación de Eliminar
        public async Task DeleteAsync(int id)
        {
            var transporte = await _context.Transportes.FindAsync(id);
            if (transporte != null)
            {
                _context.Transportes.Remove(transporte);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Transporte>> GetByRegionIdAsync(int regionId)
        {
            return await _context.Transportes
                // 1. Incluye las propiedades de navegación (Origen y DestinoFinal)
                .Include(t => t.Origen)
                .Include(t => t.DestinoFinal)
                // 2. Filtra donde el transporte tenga como origen O como destino final
                //    un Destino que pertenezca al RegionID proporcionado.
                .Where(t =>
                    (t.Origen != null && t.Origen.RegionID == regionId) ||
                    (t.DestinoFinal != null && t.DestinoFinal.RegionID == regionId)
                )
                .ToListAsync();
        }
        public async Task<IEnumerable<Transporte>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice)
        {
            return await _context.Transportes
                // Opcional pero útil: incluye las tarifas en la respuesta
                .Include(t => t.Tarifas)
                // Usa .Any() para encontrar las rutas que tienen AL MENOS UNA tarifa
                // cuyo Precio esté dentro del rango (minPrice y maxPrice).
                .Where(t => t.Tarifas.Any(tf => tf.Precio >= minPrice && tf.Precio <= maxPrice))
                .ToListAsync();
        }
    }
}