using System.ComponentModel.DataAnnotations;

namespace KillasTravel.Domain.Entities
{
    public class PaqueteServicio
    {
        [Key]
        public int PaqueteServicioID { get; set; }

        // Propiedades de la tabla PaqueteServicios
        public int PaqueteID { get; set; }
        public string TipoServicio { get; set; } = string.Empty; // 'TOUR', 'ALOJAMIENTO', 'TRANSPORTE'

        // Claves foráneas anulables
        public int? TourID { get; set; }
        public int? AlojamientoID { get; set; }
        public int? TransporteID { get; set; }

        // Propiedades de navegación
        public Paquete? Paquete { get; set; }
        public Tour? Tour { get; set; }
        public Alojamiento? Alojamiento { get; set; }
        public Transporte? Transporte { get; set; }
    }
}