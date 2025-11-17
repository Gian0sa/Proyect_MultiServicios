using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KillasTravel.Domain.Entities
{
    public class TransporteTarifa
    {
        [Key]
        public int TarifaID { get; set; }

        public int TransporteID { get; set; }

        public string NombreServicio { get; set; } = string.Empty;

        [Column(TypeName = "decimal(10, 2)")]
        public decimal Precio { get; set; }

        public string? DescripcionServicio { get; set; }

        // Propiedad de Navegación
        public Transporte? Transporte { get; set; }
    }
}