using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KillasTravel.Domain.Entities;

namespace KillasTravel.Application.Interfaces
{
    public interface IUsuarioRepository
    {
        // C - Create (Crear)
        Task<Usuario> AddAsync(Usuario usuario);

        // R - Read (Leer)
        Task<Usuario?> GetByIdAsync(int id);
        Task<IEnumerable<Usuario>> GetAllAsync();

        // U - Update (Actualizar)
        Task UpdateAsync(Usuario usuario);

        // D - Delete (Eliminar)
        Task DeleteAsync(int id);
    }
}
