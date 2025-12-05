namespace ProyTour_Transporte_Hospedaje.Dtos.PaqueteDto
{
    public class PaqueteBasicDto
    {
        public int IdPaquete { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public decimal PrecioTotal { get; set; }
    }
}