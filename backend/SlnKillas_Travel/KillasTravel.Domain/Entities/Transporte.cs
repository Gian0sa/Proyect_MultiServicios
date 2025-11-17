using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KillasTravel.Domain.Entities
{
    public class Transporte
    {
        [Key]
        public int TransporteID { get; set; }

        // Propiedades de la tabla Transportes
        public string NombreRuta { get; set; } = string.Empty;
        public int OrigenDestinoID { get; set; }
        public int DestinoFinalDestinoID { get; set; }

        // Propiedades de Navegación para EF Core
        [ForeignKey("OrigenDestinoID")]
        public Destino? Origen { get; set; }

        [ForeignKey("DestinoFinalDestinoID")]
        public Destino? DestinoFinal { get; set; }


        public string? TipoVehiculo { get; set; }
        public ICollection<TransporteTarifa> Tarifas { get; set; } = new List<TransporteTarifa>();
    }
}