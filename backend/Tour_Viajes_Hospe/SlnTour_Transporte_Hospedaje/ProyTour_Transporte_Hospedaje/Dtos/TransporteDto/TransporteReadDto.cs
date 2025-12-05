using ProyTour_Transporte_Hospedaje.Dtos.ImagenDto;

namespace ProyTour_Transporte_Hospedaje.Dtos.TransporteDto
{
    public class TransporteReadDto
    {
        // IDs
        public int IdServicio { get; set; }
        public int IdTransporte { get; set; }

        // Datos del Servicio
        public string Nombre { get; set; } = null!;
        public string? Descripcion { get; set; }
        public decimal PrecioBase { get; set; }

        // Datos del Transporte
        public string Categoria { get; set; } = null!;
        public DateTime FechaSalida { get; set; }
        public DateTime FechaLlegada { get; set; }

        // Datos de Relación (Origen y Destino)
        public int IdOrigen { get; set; }
        public string NombreOrigen { get; set; } = null!;
        public int IdDestino { get; set; }
        public string NombreDestino { get; set; } = null!;
        public string NombreDepartamentoOrigen { get; set; } = null!;
        public string NombreDepartamentoDestino { get; set; } = null!;

        // Imágenes del transporte
        public List<ImagenReadDto> Imagenes { get; set; } = new();
    }
}
