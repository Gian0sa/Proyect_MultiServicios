using System;
using System.Collections.Generic;

namespace ProyTour_Transporte_Hospedaje.Models;

public partial class Transporte
{
    public int IdTransporte { get; set; }

    public int IdServicio { get; set; }

    public int IdOrigen { get; set; }

    public int IdDestino { get; set; }

    public string Categoria { get; set; } = null!;

    public DateTime FechaSalida { get; set; }

    public DateTime FechaLlegada { get; set; }

    public virtual Destino IdDestinoNavigation { get; set; } = null!;

    public virtual Destino IdOrigenNavigation { get; set; } = null!;

    public virtual Servicio IdServicioNavigation { get; set; } = null!;
}
