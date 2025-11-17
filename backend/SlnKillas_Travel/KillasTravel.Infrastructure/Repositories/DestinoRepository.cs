using KillasTravel.Application.Interfaces;
using KillasTravel.Domain.Entities;
using KillasTravel.Infrastructure.BD;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KillasTravel.Infrastructure.Repositories
{
    public class DestinoRepository : IDestinoRepository
    {
        private readonly KillasTravelDbContext _context;

        public DestinoRepository(KillasTravelDbContext context)
        {
            _context = context;
        }

        // C - Implementación de Crear
        public async Task<Destino> AddAsync(Destino destino)
        {
            await _context.Destinos.AddAsync(destino);
            await _context.SaveChangesAsync();
            return destino;
        }

        // R - Implementación de Leer por ID
        public async Task<Destino?> GetByIdAsync(int id)
        {
            return await _context.Destinos.FindAsync(id);
        }

        // R - Implementación de Leer Todos
        public async Task<IEnumerable<Destino>> GetAllAsync()
        {
            return await _context.Destinos.ToListAsync();
        }

        // U - Implementación de Actualizar
        public async Task UpdateAsync(Destino destino)
        {
            _context.Entry(destino).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        // D - Implementación de Eliminar
        public async Task DeleteAsync(int id)
        {
            var destino = await _context.Destinos.FindAsync(id);
            if (destino != null)
            {
                _context.Destinos.Remove(destino);
                await _context.SaveChangesAsync();
            }
        }
    }
}