using System.Collections.Generic;

namespace KillasTravel.Domain.Entities
{
    public class Destino
    {
        public int DestinoID { get; set; }
        public string Nombre { get; set; } = string.Empty;


        public string Descripcion { get; set; } = string.Empty;

        // NUEVAS PROPIEDADES DE FILTRADO:
        public int RegionID { get; set; }
        public Region? Region { get; set; } // Propiedad de Navegación

        // Propiedades de Navegación:
        public ICollection<Tour> Tours { get; set; } = new List<Tour>();
    }
}