namespace ProyTour_Transporte_Hospedaje.Dtos.Logeo
{
    // Ejemplo de DTO de Respuesta de Login (o similar)
    public class LoginResponseDto
    {
        public string Token { get; set; } = ""; 
        public int UsuarioId { get; set; }
        public string Nombre { get; set; } = "";
        // AÑADIR ESTA PROPIEDAD
        public string Role { get; set; } = "";
        // ... otros campos
    }
}
