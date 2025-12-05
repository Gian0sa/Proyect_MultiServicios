using ProyTour_Transporte_Hospedaje.Dtos.ImagenDto;

namespace ProyTour_Transporte_Hospedaje.Dtos.PaqueteDto.Detalle
{
    public class PaqueteDetalleReadDto
    {
        public int IdServicio { get; set; }
        public string TipoServicio { get; set; } = null!;
        public string NombreServicio { get; set; } = null!;
        public decimal PrecioBase { get; set; }
        
        // Imágenes del servicio (Hospedaje, Tour o Transporte)
        public List<ImagenReadDto> Imagenes { get; set; } = new();
    }

}
