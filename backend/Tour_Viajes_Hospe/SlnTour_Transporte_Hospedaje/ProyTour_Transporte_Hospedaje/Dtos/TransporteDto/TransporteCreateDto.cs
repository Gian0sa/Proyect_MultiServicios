using System.ComponentModel.DataAnnotations;

namespace ProyTour_Transporte_Hospedaje.Dtos.TransporteDto
{
    public class TransporteCreateDto
    {
        // Campos de la tabla SERVICIO (Base)
        [Required(ErrorMessage = "El nombre del servicio es obligatorio.")]
        [StringLength(120)]
        public string Nombre { get; set; } = null!;

        [StringLength(255)]
        public string? Descripcion { get; set; }

        [Required(ErrorMessage = "El precio base es obligatorio.")]
        [Range(0.01, 9999.99)]
        public decimal PrecioBase { get; set; }

        // Campos de la tabla TRANSPORTE (Detalle)
        [Required(ErrorMessage = "Debe especificar el ID del destino de origen.")]
        public int IdOrigen { get; set; } // FK a Destino

        [Required(ErrorMessage = "Debe especificar el ID del destino final.")]
        public int IdDestino { get; set; } // FK a Destino

        [Required(ErrorMessage = "La categoría (NORMAL, GERENCIAL, VIP) es obligatoria.")]
        [StringLength(20)]
        public string Categoria { get; set; } = null!;

        [Required(ErrorMessage = "La fecha de salida es obligatoria.")]
        public DateTime FechaSalida { get; set; }

        [Required(ErrorMessage = "La fecha de llegada es obligatoria.")]
        public DateTime FechaLlegada { get; set; }
    }
}
