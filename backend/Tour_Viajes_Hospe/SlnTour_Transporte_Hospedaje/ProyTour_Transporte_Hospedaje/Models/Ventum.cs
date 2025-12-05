using System;
using System.Collections.Generic;

namespace ProyTour_Transporte_Hospedaje.Models;

public partial class Venta
{
    public int IdVenta { get; set; }

    public int IdUsuario { get; set; }

    public DateTime FechaVenta { get; set; }

    public decimal Total { get; set; }

    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;

    public virtual ICollection<VentaDetalle> VentaDetalles { get; set; } = new List<VentaDetalle>();
}
