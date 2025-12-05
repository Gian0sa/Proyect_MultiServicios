using System.ComponentModel.DataAnnotations;

namespace ProyTour_Transporte_Hospedaje.Dtos.TourDto
{
    public class TourCreateDto
    {
        // Campos de la tabla SERVICIO
        [Required]
        [StringLength(120)]
        public string Nombre { get; set; } = null!;

        [StringLength(255)]
        public string? Descripcion { get; set; }

        [Required]
        [Range(0.01, 9999.99)]
        public decimal PrecioBase { get; set; }

        // Campos de la tabla TOUR
        [Required]
        public int IdDestino { get; set; }

        [StringLength(50)]
        public string? Duracion { get; set; }

        public bool GuiaIncluido { get; set; } // BIT/bool
    }
}
