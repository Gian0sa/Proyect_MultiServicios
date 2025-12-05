using System.ComponentModel.DataAnnotations;

namespace ProyTour_Transporte_Hospedaje.Dtos
{
    public class UsuarioCreateDto
    {
        [Required(ErrorMessage = "El DNI es obligatorio.")]
        [StringLength(8, MinimumLength = 8, ErrorMessage = "El DNI debe tener 8 dígitos.")]
        public string Dni { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El apellido es obligatorio.")]
        public string Apellido { get; set; } = string.Empty;

        [Required(ErrorMessage = "El email es obligatorio.")]
        [EmailAddress(ErrorMessage = "Formato de email incorrecto.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
        public string Password { get; set; } = string.Empty;

        // El frontend NO debe enviar IdUsuario, FechaVenta, o el Hash de la contraseña.
    }
}
