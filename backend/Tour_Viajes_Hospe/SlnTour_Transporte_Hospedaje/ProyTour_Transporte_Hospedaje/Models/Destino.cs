using System;
using System.Collections.Generic;

namespace ProyTour_Transporte_Hospedaje.Models;

public partial class Destino
{
    public int IdDestino { get; set; }

    public int IdDepartamento { get; set; }

    public string NombreDestino { get; set; } = null!;

    public string? Descripcion { get; set; }

    public virtual ICollection<Hospedaje> Hospedajes { get; set; } = new List<Hospedaje>();

    public virtual Departamento IdDepartamentoNavigation { get; set; } = null!;

    public virtual ICollection<Tour> Tours { get; set; } = new List<Tour>();

    public virtual ICollection<Transporte> TransporteIdDestinoNavigations { get; set; } = new List<Transporte>();

    public virtual ICollection<Transporte> TransporteIdOrigenNavigations { get; set; } = new List<Transporte>();
}
