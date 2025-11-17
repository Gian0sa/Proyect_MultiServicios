using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KillasTravel.Domain.Entities;

namespace KillasTravel.Application.Interfaces
{
    public interface IPaqueteServicioRepository
    {

        // C - Create (Crear)
        Task<PaqueteServicio> AddAsync(PaqueteServicio paqueteServicio);

        // R - Read (Leer)
        Task<PaqueteServicio?> GetByIdAsync(int id);
        Task<IEnumerable<PaqueteServicio>> GetAllAsync();

        // U - Update (Actualizar)
        Task UpdateAsync(PaqueteServicio paqueteServicio);

        // D - Delete (Eliminar)
        Task DeleteAsync(int id);
    }
}
