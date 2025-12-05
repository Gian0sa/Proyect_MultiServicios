using System;
using System.Collections.Generic;

namespace ProyTour_Transporte_Hospedaje.Models;

public partial class VentaDetalle
{
    public int IdVentaDetalle { get; set; }

    public int IdVenta { get; set; }

    public string TipoItem { get; set; } = null!;

    public int? IdServicio { get; set; }

    public int? IdPaquete { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }

    public decimal? Subtotal { get; set; }

    public virtual Paquete? IdPaqueteNavigation { get; set; }

    public virtual Servicio? IdServicioNavigation { get; set; }

    public virtual Venta IdVentaNavigation { get; set; } = null!;
}
