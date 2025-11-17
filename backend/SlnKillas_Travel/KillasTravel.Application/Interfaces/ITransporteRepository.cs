using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KillasTravel.Domain.Entities;

namespace KillasTravel.Application.Interfaces
{
    public interface ITransporteRepository
    {
        // C - Create (Crear)
        Task<Transporte> AddAsync(Transporte transporte);

        // R - Read (Leer)
        Task<Transporte?> GetByIdAsync(int id);
        Task<IEnumerable<Transporte>> GetAllAsync();
        Task<IEnumerable<Transporte>> GetByRegionIdAsync(int regionId);
        Task<IEnumerable<Transporte>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice);
        // U - Update (Actualizar)
        Task UpdateAsync(Transporte transporte);

        // D - Delete (Eliminar)
        Task DeleteAsync(int id);
    }
}
