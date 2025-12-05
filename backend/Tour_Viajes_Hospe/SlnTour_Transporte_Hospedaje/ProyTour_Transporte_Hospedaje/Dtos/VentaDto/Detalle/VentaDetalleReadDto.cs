namespace ProyTour_Transporte_Hospedaje.Dtos.VentaDto.Detalle
{
    public class VentaDetalleReadDto
    {
        public int IdVentaDetalle { get; set; }
        public string TipoItem { get; set; } = null!;
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }

        // Nombre del ítem (Servicio o Paquete)
        public string NombreItem { get; set; } = null!;
    }
}
