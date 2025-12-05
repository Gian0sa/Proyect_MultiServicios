using System;
using System.Collections.Generic;

namespace ProyTour_Transporte_Hospedaje.Models;

public partial class Tour
{
    public int IdTour { get; set; }

    public int IdServicio { get; set; }

    public int IdDestino { get; set; }

    public string? Duracion { get; set; }

    public bool? GuiaIncluido { get; set; }

    public virtual Destino IdDestinoNavigation { get; set; } = null!;

    public virtual Servicio IdServicioNavigation { get; set; } = null!;
}
