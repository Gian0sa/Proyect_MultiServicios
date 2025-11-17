using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KillasTravel.Domain.Entities;

namespace KillasTravel.Application.Interfaces
{
    public interface IAlojamientoRepository
    {
        // C - Create (Crear)
        Task<Alojamiento> AddAsync(Alojamiento alojamiento);

        // R - Read (Leer)
        Task<Alojamiento?> GetByIdAsync(int id);
        Task<IEnumerable<Alojamiento>> GetAllAsync();

        // U - Update (Actualizar)
        Task UpdateAsync(Alojamiento alojamiento);

        // D - Delete (Eliminar)
        Task DeleteAsync(int id);

        Task<IEnumerable<Alojamiento>> GetByRegionIdAsync(int regionId);
        Task<IEnumerable<Alojamiento>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice);
    }
}
