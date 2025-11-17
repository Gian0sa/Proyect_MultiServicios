using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KillasTravel.Domain.Entities;

namespace KillasTravel.Application.Interfaces
{
    public  interface IOrdenRepository
    {
        // C - Create (Crear)
        Task<Orden> AddAsync(Orden orden);

        // R - Read (Leer)
        Task<Orden?> GetByIdAsync(int id);
        Task<IEnumerable<Orden>> GetAllAsync();

        // U - Update (Actualizar)
        Task UpdateAsync(Orden orden);

        // D - Delete (Eliminar)
        Task DeleteAsync(int id);

    }
}
