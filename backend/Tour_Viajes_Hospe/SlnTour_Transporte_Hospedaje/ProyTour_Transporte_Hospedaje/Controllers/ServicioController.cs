using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProyTour_Transporte_Hospedaje.Dtos;
using ProyTour_Transporte_Hospedaje.Interfaces;

namespace ProyTour_Transporte_Hospedaje.Controllers
{
    [Route("api/[controller]")] // Ruta: /api/Servicio
    [ApiController]
    public class ServicioController : ControllerBase
    {
        private readonly IServicioRepository _repositorio;

        public ServicioController(IServicioRepository repositorio)
        {
            _repositorio = repositorio;
        }

        // ==========================================================
        // GET: /api/Servicio (Listar todos)
        // Ejemplo: /api/Servicio
        // ==========================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServicioReadDto>>> GetServicios()
        {
            var serviciosDto = await _repositorio.ObtenerTodosDtoAsync();

            if (serviciosDto == null || !serviciosDto.Any())
            {
                return NotFound("No se encontraron servicios.");
            }

            return Ok(serviciosDto);
        }

        // ==========================================================
        // GET: /api/Servicio/filtrar?tipo=HOSPEDAJE (Listar por Tipo)
        // ==========================================================
        [HttpGet("filtrar")]
        public async Task<ActionResult<IEnumerable<ServicioReadDto>>> GetServiciosPorTipo([FromQuery] string tipo)
        {
            if (string.IsNullOrEmpty(tipo))
            {
                return BadRequest("El parámetro 'tipo' es obligatorio.");
            }

            // Validación de tipos permitidos (coincide con el CHECK de la DB)
            string tipoUpper = tipo.ToUpper();
            if (tipoUpper != "HOSPEDAJE" && tipoUpper != "TOUR" && tipoUpper != "TRANSPORTE")
            {
                return BadRequest("Tipo de servicio inválido. Use HOSPEDAJE, TOUR o TRANSPORTE.");
            }

            var serviciosDto = await _repositorio.ObtenerPorTipoDtoAsync(tipoUpper);

            if (serviciosDto == null || !serviciosDto.Any())
            {
                return NotFound($"No se encontraron servicios de tipo {tipoUpper}.");
            }

            return Ok(serviciosDto);
        }
    }
}
