using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KillasTravel.Domain.Entities;

namespace KillasTravel.Application.Interfaces
{
    public interface IPaqueteRepository
    {
        // C - Create (Crear)
        Task<Paquete> AddAsync(Paquete paquete);

        // R - Read (Leer)
        Task<Paquete?> GetByIdAsync(int id);
        Task<IEnumerable<Paquete>> GetAllAsync();

        // U - Update (Actualizar)
        Task UpdateAsync(Paquete paquete);

        // D - Delete (Eliminar)
        Task DeleteAsync(int id);
    }
}
