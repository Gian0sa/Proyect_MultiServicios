using ProyTour_Transporte_Hospedaje.Dtos.PaqueteDto.Detalle;

namespace ProyTour_Transporte_Hospedaje.Dtos.PaqueteDto
{
    public class PaqueteReadDto
    {
        public int IdPaquete { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public decimal PrecioTotal { get; set; }
        public bool EsPromocion { get; set; }

        // Lista de servicios que contiene este paquete (cada servicio ya incluye sus imágenes)
        public List<PaqueteDetalleReadDto> Servicios { get; set; } = new();
    }
}
