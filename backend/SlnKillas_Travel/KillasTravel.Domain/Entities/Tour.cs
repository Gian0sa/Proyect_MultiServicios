using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KillasTravel.Domain.Entities
{
    public class Tour
    {
        [Key]
        public int TourID { get; set; }

        // Propiedades de la tabla Tours
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }

        [Column(TypeName = "decimal(10, 2)")] // Mapea al tipo DECIMAL(10, 2) de SQL
        public decimal Precio { get; set; }

        public int DuracionDias { get; set; }

        public int? DestinoID { get; set; }

        // Propiedad de navegación
        public Destino? Destino { get; set; }
    }
}