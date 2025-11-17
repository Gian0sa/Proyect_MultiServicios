using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KillasTravel.Application.DTOs
{
    public class AlojamientoResponseDto
    {
        public int AlojamientoID { get; set; }
        public string Nombre { get; set; } = "";
        public string Ciudad { get; set; } = "";
        public decimal PrecioPorNoche { get; set; }
        public string Categoria { get; set; } = "";
        public int? DestinoID { get; set; }
        public string? NombreDestino { get; set; } // Opcional, para mostrar el nombre del destino
    }
}
