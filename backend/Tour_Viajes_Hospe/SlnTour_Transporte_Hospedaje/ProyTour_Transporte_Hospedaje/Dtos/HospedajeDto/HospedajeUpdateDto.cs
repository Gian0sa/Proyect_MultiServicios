using System.ComponentModel.DataAnnotations;

namespace ProyTour_Transporte_Hospedaje.Dtos.HospedajeDto
{
    public class HospedajeUpdateDto
    {
        [Required(ErrorMessage = "El nombre del hospedaje es obligatorio.")]
        [StringLength(120)]
        public string Nombre { get; set; } = null!;

        [StringLength(255)]
        public string? Descripcion { get; set; }

        [Required(ErrorMessage = "El precio base es obligatorio.")]
        [Range(0.01, 9999.99)]
        public decimal PrecioBase { get; set; }

        [Required(ErrorMessage = "Debe especificar el ID del destino.")]
        public int IdDestino { get; set; }

        [StringLength(50)]
        public string? RangoPrecio { get; set; }

        [Required(ErrorMessage = "La capacidad es obligatoria.")]
        [Range(1, 100)]
        public int Capacidad { get; set; }

        [StringLength(255)]
        public string? ServiciosIncluidos { get; set; }
    }
}
