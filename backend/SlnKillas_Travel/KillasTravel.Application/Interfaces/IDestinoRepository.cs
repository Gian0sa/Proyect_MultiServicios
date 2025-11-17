using KillasTravel.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KillasTravel.Application.Interfaces
{
    public interface IDestinoRepository
    {
        // CRUD Básico para la administración de destinos

        // C - Create (Crear)
        Task<Destino> AddAsync(Destino destino);

        // R - Read (Leer)
        Task<Destino?> GetByIdAsync(int id);
        Task<IEnumerable<Destino>> GetAllAsync();

        // U - Update (Actualizar)
        Task UpdateAsync(Destino destino);

        // D - Delete (Eliminar)
        Task DeleteAsync(int id);
    }
}