using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KillasTravel.Domain.Entities
{
    public class Usuario
    {
        [Key]
        public int UsuarioID { get; set; }

        // Propiedades de la tabla Usuarios
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string? Telefono { get; set; } // Puede ser nulo
        public string Rol { get; set; } = string.Empty; // 'Admin' o 'Cliente'

        // Propiedad de navegación
        public ICollection<Orden>? Ordenes { get; set; }
    }
}