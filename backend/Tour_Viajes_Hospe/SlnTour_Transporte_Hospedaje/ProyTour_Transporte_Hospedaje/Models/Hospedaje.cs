using System;
using System.Collections.Generic;

namespace ProyTour_Transporte_Hospedaje.Models;

public partial class Hospedaje
{
    public int IdHospedaje { get; set; }

    public int IdServicio { get; set; }

    public int IdDestino { get; set; }

    public string? RangoPrecio { get; set; }

    public int? Capacidad { get; set; }

    public string? ServiciosIncluidos { get; set; }

    public virtual Destino IdDestinoNavigation { get; set; } = null!;

    public virtual Servicio IdServicioNavigation { get; set; } = null!;
}
