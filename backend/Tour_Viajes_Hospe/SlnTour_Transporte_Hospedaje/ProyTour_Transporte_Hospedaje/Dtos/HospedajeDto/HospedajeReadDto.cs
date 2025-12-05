using ProyTour_Transporte_Hospedaje.Dtos.ImagenDto;

namespace ProyTour_Transporte_Hospedaje.Dtos.HospedajeDto
{
    public class HospedajeReadDto
    {
        // IDs (Para operaciones de actualización/detalle)
        public int IdServicio { get; set; } // ID de la tabla base (Servicio)
        public int IdHospedaje { get; set; } // ID de la tabla detalle (Hospedaje)

        // Datos del Servicio
        public string Nombre { get; set; } = null!;
        public string? Descripcion { get; set; }
        public decimal PrecioBase { get; set; }

        // Datos del Hospedaje
        public string? RangoPrecio { get; set; }
        public int Capacidad { get; set; }
        public string? ServiciosIncluidos { get; set; }

        // Datos de Relación (Mapeo manual desde el Repositorio)
        public int IdDestino { get; set; }
        public string NombreDestino { get; set; } = null!;
        public string NombreDepartamento { get; set; } = null!;

        // Imágenes del hospedaje
        public List<ImagenReadDto> Imagenes { get; set; } = new();
    }
}
