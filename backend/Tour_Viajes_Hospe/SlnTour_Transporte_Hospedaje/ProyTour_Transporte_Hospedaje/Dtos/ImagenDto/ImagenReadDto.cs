namespace ProyTour_Transporte_Hospedaje.Dtos.ImagenDto
{
    public class ImagenReadDto
    {
        public int IdImagen { get; set; }
        public string TipoEntidad { get; set; } = string.Empty; // HOSPEDAJE, TOUR, TRANSPORTE, PAQUETE
        public int IdEntidad { get; set; }
        public string Url { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
    }
}

