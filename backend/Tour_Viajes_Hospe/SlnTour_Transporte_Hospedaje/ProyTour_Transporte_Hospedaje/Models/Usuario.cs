using System;
using System.Collections.Generic;

namespace ProyTour_Transporte_Hospedaje.Models;

public partial class Usuario
{
    public int IdUsuario { get; set; }

    public string Dni { get; set; } = null!;

    public string Nombre { get; set; } = null!;

    public string Apellido { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? Telefono { get; set; }

    public virtual ICollection<Venta> Venta { get; set; } = new List<Venta>();

    public virtual ICollection<Rol> IdRols { get; set; } = new List<Rol>();
}
