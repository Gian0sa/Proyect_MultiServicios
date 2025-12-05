using System;
using System.Collections.Generic;

namespace ProyTour_Transporte_Hospedaje.Models;

public partial class Imagen
{
    public int IdImagen { get; set; }

    public string TipoEntidad { get; set; } = null!;

    public int IdEntidad { get; set; }

    public string Url { get; set; } = null!;

    public string? Descripcion { get; set; }
}
