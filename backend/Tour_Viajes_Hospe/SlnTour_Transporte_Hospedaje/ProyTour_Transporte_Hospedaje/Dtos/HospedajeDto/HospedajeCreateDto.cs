using System.ComponentModel.DataAnnotations;

namespace ProyTour_Transporte_Hospedaje.Dtos.HospedajeDto
{
    public class HospedajeCreateDto
    {
        // Campos de la tabla SERVICIO
        [Required]
        [StringLength(120)]
        public string Nombre { get; set; } = null!;

        [StringLength(255)]
        public string? Descripcion { get; set; }

        [Required]
        [Range(0.01, 9999.99)]
        public decimal PrecioBase { get; set; }

        // El TipoServicio es 'HOSPEDAJE' por defecto, no lo pedimos al usuario

        // Campos de la tabla HOSPEDAJE
        [Required]
        public int IdDestino { get; set; }

        [StringLength(50)]
        public string? RangoPrecio { get; set; }

        [Required]
        [Range(1, 100)]
        public int Capacidad { get; set; }

        [StringLength(255)]
        public string? ServiciosIncluidos { get; set; }
    }
}
