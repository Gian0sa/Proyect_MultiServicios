using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KillasTravel.Domain.Entities
{
    public class Orden
    {
        [Key]
        public int OrdenID { get; set; }

        // Propiedades de la tabla Ordenes
        public int UsuarioID { get; set; }
        public DateTime FechaOrden { get; set; } = DateTime.Now;

        [Column(TypeName = "decimal(10, 2)")]
        public decimal MontoTotal { get; set; }

        public string Estado { get; set; } = string.Empty;

        // Propiedades de navegación
        public Usuario? Usuario { get; set; }
        public ICollection<DetalleOrden>? Detalles { get; set; }
    }
}