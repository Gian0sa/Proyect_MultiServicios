using System.ComponentModel.DataAnnotations;

namespace ProyTour_Transporte_Hospedaje.Dtos.DestinoDto
{
    public class DestinoCreateDto
    {
        [Required(ErrorMessage = "El nombre del destino es obligatorio.")]
        public string NombreDestino { get; set; } = null!;

        public string? Descripcion { get; set; }

        [Required(ErrorMessage = "Debe especificar el ID del Departamento.")]
        public int IdDepartamento { get; set; } // Solo necesitamos la FK
    }
}
