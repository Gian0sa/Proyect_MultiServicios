using System;
using System.Collections.Generic;

namespace ProyTour_Transporte_Hospedaje.Models;

public partial class PaqueteDetalle
{
    public int IdPaqueteDetalle { get; set; }

    public int IdPaquete { get; set; }

    public int IdServicio { get; set; }

    public virtual Paquete IdPaqueteNavigation { get; set; } = null!;

    public virtual Servicio IdServicioNavigation { get; set; } = null!;
}
