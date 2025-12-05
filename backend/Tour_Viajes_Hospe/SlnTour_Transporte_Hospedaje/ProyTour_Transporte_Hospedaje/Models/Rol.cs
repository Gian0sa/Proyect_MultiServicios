using System;
using System.Collections.Generic;

namespace ProyTour_Transporte_Hospedaje.Models;

public partial class Rol
{
    public int IdRol { get; set; }

    public string NombreRol { get; set; } = null!;

    public virtual ICollection<Usuario> IdUsuarios { get; set; } = new List<Usuario>();
}
