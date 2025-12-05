using System;
using System.Collections.Generic;

namespace ProyTour_Transporte_Hospedaje.Models;

public partial class Servicio
{
    public int IdServicio { get; set; }

    public string TipoServicio { get; set; } = null!;

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public decimal PrecioBase { get; set; }

    public virtual ICollection<Hospedaje> Hospedajes { get; set; } = new List<Hospedaje>();

    public virtual ICollection<PaqueteDetalle> PaqueteDetalles { get; set; } = new List<PaqueteDetalle>();

    public virtual ICollection<Tour> Tours { get; set; } = new List<Tour>();

    public virtual ICollection<Transporte> Transportes { get; set; } = new List<Transporte>();

    public virtual ICollection<VentaDetalle> VentaDetalles { get; set; } = new List<VentaDetalle>();
}
