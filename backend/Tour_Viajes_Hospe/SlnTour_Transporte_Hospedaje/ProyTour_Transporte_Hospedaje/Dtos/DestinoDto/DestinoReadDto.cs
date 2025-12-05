namespace ProyTour_Transporte_Hospedaje.Dtos.DestinoDto
{
    // Archivo: Dtos/DestinoReadDto.cs

    // Usamos solo las propiedades escalares y la FK del departamento
    public class DestinoReadDto
    {
        public int IdDestino { get; set; }
        public string NombreDestino { get; set; } = null!;
        public string? Descripcion { get; set; }
        public int IdDepartamento { get; set; } // Incluimos la FK

        // Opcional pero útil: El nombre del departamento (si lo mapeamos)
        public string NombreDepartamento { get; set; } = null!;

        // IMPORTANTE: NO incluimos la propiedad de navegación 'IdDepartamentoNavigation' (objeto completo) 
        // ni las colecciones de servicios (Hospedaje, Tour, Transporte).
    }
}
