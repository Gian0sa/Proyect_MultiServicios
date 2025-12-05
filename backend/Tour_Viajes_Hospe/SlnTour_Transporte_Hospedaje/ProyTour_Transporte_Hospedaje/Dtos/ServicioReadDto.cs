namespace ProyTour_Transporte_Hospedaje.Dtos
{
    public class ServicioReadDto
    {
        public int IdServicio { get; set; }
        public string TipoServicio { get; set; } = null!; // HOSPEDAJE, TOUR, TRANSPORTE
        public string Nombre { get; set; } = null!;
        public string? Descripcion { get; set; }
        public decimal PrecioBase { get; set; }
    }
}
