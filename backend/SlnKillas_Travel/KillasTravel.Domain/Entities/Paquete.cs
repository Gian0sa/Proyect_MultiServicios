using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KillasTravel.Domain.Entities
{
    public class Paquete
    {
        [Key]
        public int PaqueteID { get; set; }

        // Propiedades de la tabla Paquetes
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int? DuracionDias { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal PrecioTotal { get; set; }

        // Propiedad de navegación
        public ICollection<PaqueteServicio>? ServiciosIncluidos { get; set; }
    }
}