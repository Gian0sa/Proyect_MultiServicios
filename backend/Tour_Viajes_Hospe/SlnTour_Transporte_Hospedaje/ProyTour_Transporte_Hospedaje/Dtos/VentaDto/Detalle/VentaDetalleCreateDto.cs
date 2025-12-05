using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProyTour_Transporte_Hospedaje.Dtos.VentaDto.Detalle
{
    public class VentaDetalleCreateDto
    {
        // Define el tipo de ítem que se vende
        [Required(ErrorMessage = "El tipo de ítem es obligatorio.")]
        [JsonConverter(typeof(JsonStringEnumConverter))] // Permite enviar "SERVICIO" o "PAQUETE" como string
        public VentaItemType TipoItem { get; set; }

        // Id del Servicio vendido (si TipoItem = SERVICIO)
        public int? IdServicio { get; set; }

        // Id del Paquete vendido (si TipoItem = PAQUETE)
        public int? IdPaquete { get; set; }

        [Required(ErrorMessage = "La cantidad es obligatoria.")]
        [Range(1, 100, ErrorMessage = "La cantidad debe ser al menos 1.")]
        public int Cantidad { get; set; }
    }
}
