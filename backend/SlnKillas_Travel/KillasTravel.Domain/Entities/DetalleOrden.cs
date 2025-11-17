using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KillasTravel.Domain.Entities
{
    public class DetalleOrden
    {
        [Key]
        public int DetalleOrdenID { get; set; }

        // Propiedades de la tabla DetalleOrden
        public int OrdenID { get; set; }
        public string TipoProducto { get; set; } = string.Empty;
        public int ProductoID { get; set; }
        public int Cantidad { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal PrecioUnitario { get; set; }

        // Propiedad de navegación
        public Orden? Orden { get; set; }
    }
}