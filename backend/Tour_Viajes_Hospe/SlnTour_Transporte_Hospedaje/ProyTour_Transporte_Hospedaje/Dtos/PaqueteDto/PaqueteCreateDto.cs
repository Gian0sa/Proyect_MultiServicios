using ProyTour_Transporte_Hospedaje.Dtos.PaqueteDto.Detalle;
using System.ComponentModel.DataAnnotations;

namespace ProyTour_Transporte_Hospedaje.Dtos.PaqueteDto
{
    public class PaqueteCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = null!;

        [MaxLength(500)]
        public string? Descripcion { get; set; }

        [Required]
        [Range(0.01, (double)decimal.MaxValue)]
        public decimal PrecioTotal { get; set; }

        public bool EsPromocion { get; set; }

        [Required]
        public List<PaqueteServicioDto> Servicios { get; set; } = new();
    }

}
