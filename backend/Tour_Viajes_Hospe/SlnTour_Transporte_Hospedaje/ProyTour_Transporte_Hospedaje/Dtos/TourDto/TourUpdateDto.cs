using System.ComponentModel.DataAnnotations;

namespace ProyTour_Transporte_Hospedaje.Dtos.TourDto
{
    public class TourUpdateDto
    {
        // Campos de la tabla SERVICIO (para actualizar)
        [Required(ErrorMessage = "El nombre del tour es obligatorio.")]
        [StringLength(120)]
        public string Nombre { get; set; } = null!;

        [StringLength(255)]
        public string? Descripcion { get; set; }

        [Required(ErrorMessage = "El precio base es obligatorio.")]
        [Range(0.01, 9999.99)]
        public decimal PrecioBase { get; set; }

        // Campos de la tabla TOUR (para actualizar)
        [Required(ErrorMessage = "Debe especificar el ID del destino.")]
        public int IdDestino { get; set; } // Permitimos cambiar el destino del tour

        [StringLength(50)]
        public string? Duracion { get; set; }

        public bool GuiaIncluido { get; set; } // Puede cambiarse si incluye guía o no
    }
}
