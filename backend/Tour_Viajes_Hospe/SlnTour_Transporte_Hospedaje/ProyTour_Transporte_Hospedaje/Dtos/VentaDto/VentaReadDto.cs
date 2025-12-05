using ProyTour_Transporte_Hospedaje.Dtos.VentaDto.Detalle;

namespace ProyTour_Transporte_Hospedaje.Dtos.VentaDto
{
    public class VentaReadDto
    {
        public int IdVenta { get; set; }
        public DateTime FechaVenta { get; set; }
        public decimal Total { get; set; }

        // Información del Usuario
        public int IdUsuario { get; set; }
        public string NombreUsuario { get; set; } = null!;

        public List<VentaDetalleReadDto> Detalles { get; set; } = new List<VentaDetalleReadDto>();
    }
}
