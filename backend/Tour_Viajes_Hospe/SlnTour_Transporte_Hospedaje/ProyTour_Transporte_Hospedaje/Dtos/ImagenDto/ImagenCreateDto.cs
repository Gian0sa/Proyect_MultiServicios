using System.ComponentModel.DataAnnotations;

namespace ProyTour_Transporte_Hospedaje.Dtos.ImagenDto
{
    public class ImagenCreateDto
    {
        [Required]
        [StringLength(20)]
        public string TipoEntidad { get; set; } = string.Empty; // HOSPEDAJE, TOUR, TRANSPORTE, PAQUETE

        [Required]
        public int IdEntidad { get; set; }

        [Required]
        [StringLength(255)]
        [Url]
        public string Url { get; set; } = string.Empty;

        [StringLength(255)]
        public string? Descripcion { get; set; }
    }
}

