
using System.Collections.Generic;

namespace KillasTravel.Domain.Entities
{
    public class Region
    {
        public int RegionID { get; set; }
        public string Nombre { get; set; } = string.Empty;

        // Propiedad de Navegación para ver qué destinos tiene esta región
        public ICollection<Destino> Destinos { get; set; } = new List<Destino>();
    }
}