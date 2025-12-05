using ProyTour_Transporte_Hospedaje.Dtos.VentaDto.Detalle;
using System.ComponentModel.DataAnnotations;

namespace ProyTour_Transporte_Hospedaje.Dtos.VentaDto
{
    public class VentaCreateDto
    {
        // La ID del usuario se obtiene del JWT Token, ¡no la pedimos en el cuerpo!

        [Required(ErrorMessage = "La lista de detalles de venta no puede estar vacía.")]
        [MinLength(1)]
        public List<VentaDetalleCreateDto> Detalles { get; set; } = new List<VentaDetalleCreateDto>();
    }
}
