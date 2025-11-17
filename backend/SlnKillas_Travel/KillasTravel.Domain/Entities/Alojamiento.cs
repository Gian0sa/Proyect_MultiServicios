using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KillasTravel.Domain.Entities
{
    public class Alojamiento
    {
        [Key]
        public int AlojamientoID { get; set; }

        // Propiedades de la tabla Alojamientos
        public string Nombre { get; set; } = string.Empty;
        public string Ciudad { get; set; } = string.Empty;
        public string? Direccion { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal PrecioPorNoche { get; set; }

        public string? Categoria { get; set; }
        public int? DestinoID { get; set; } 
        public Destino? Destino { get; set; }
    }
}