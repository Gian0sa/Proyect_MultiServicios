using System;
using System.Collections.Generic;

namespace ProyTour_Transporte_Hospedaje.Models;

public partial class Paquete
{
    public int IdPaquete { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public decimal PrecioTotal { get; set; }

    public bool? EsPromocion { get; set; }

    public virtual ICollection<PaqueteDetalle> PaqueteDetalles { get; set; } = new List<PaqueteDetalle>();

    public virtual ICollection<VentaDetalle> VentaDetalles { get; set; } = new List<VentaDetalle>();
}
