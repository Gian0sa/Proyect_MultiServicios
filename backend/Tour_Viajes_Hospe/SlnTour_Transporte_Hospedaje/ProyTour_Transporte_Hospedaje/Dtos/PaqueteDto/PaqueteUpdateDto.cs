using ProyTour_Transporte_Hospedaje.Dtos.PaqueteDto.Detalle;
using System.ComponentModel.DataAnnotations;

namespace ProyTour_Transporte_Hospedaje.Dtos.PaqueteDto
{
    public class PaqueteUpdateDto
    {
        // Campos básicos (requeridos para PUT, ya que reemplaza el recurso)
        [Required(ErrorMessage = "El nombre del paquete es obligatorio.")]
        [MaxLength(100)]
        public string Nombre { get; set; } = null!;

        [MaxLength(500)]
        public string? Descripcion { get; set; }

        [Required(ErrorMessage = "El precio total es obligatorio.")]
        [Range(0.01, (double)decimal.MaxValue, ErrorMessage = "El precio debe ser mayor que cero.")]
        public decimal PrecioTotal { get; set; }

        public bool EsPromocion { get; set; }

        // Lista de servicios que COMPONDRÁN el paquete después de la actualización
        [Required(ErrorMessage = "El paquete debe incluir al menos un servicio.")]
        public List<PaqueteServicioDto> Servicios { get; set; } = new List<PaqueteServicioDto>();
    }
}
