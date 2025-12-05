using System;
using System.Collections.Generic;

namespace ProyTour_Transporte_Hospedaje.Models;

public partial class Departamento
{
    public int IdDepartamento { get; set; }

    public string NombreDepartamento { get; set; } = null!;

    public virtual ICollection<Destino> Destinos { get; set; } = new List<Destino>();
}
