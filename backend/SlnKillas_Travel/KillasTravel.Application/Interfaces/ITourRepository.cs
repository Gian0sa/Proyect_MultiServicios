using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KillasTravel.Domain.Entities;

namespace KillasTravel.Application.Interfaces
{
    public interface ITourRepository
    {
        // C - Create (Crear)
        Task<Tour> AddAsync(Tour tour);

        // R - Read (Leer)
        Task<Tour?> GetByIdAsync(int id);
        Task<IEnumerable<Tour>> GetAllAsync();
        Task<IEnumerable<Tour>> GetByRegionIdAsync(int regionId);
        Task<IEnumerable<Tour>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice);
        // U - Update (Actualizar)
        Task UpdateAsync(Tour tour);

        // D - Delete (Eliminar)
        Task DeleteAsync(int id);
    }
}
