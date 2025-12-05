using ProyTour_Transporte_Hospedaje.Dtos.ImagenDto;

namespace ProyTour_Transporte_Hospedaje.Dtos.TourDto
{
    public class TourReadDto
    {
        // IDs
        public int IdServicio { get; set; }
        public int IdTour { get; set; }

        // Datos del Servicio
        public string Nombre { get; set; } = null!;
        public string? Descripcion { get; set; }
        public decimal PrecioBase { get; set; }

        // Datos del Tour
        public string? Duracion { get; set; }
        public bool GuiaIncluido { get; set; }

        // Datos de Relación (Destino y Departamento)
        public int IdDestino { get; set; }
        public string NombreDestino { get; set; } = null!;
        public string NombreDepartamento { get; set; } = null!;

        // Imágenes del tour
        public List<ImagenReadDto> Imagenes { get; set; } = new();
    }
}
