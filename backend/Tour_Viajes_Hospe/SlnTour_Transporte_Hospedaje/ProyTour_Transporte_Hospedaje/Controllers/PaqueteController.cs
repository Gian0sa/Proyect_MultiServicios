using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyTour_Transporte_Hospedaje.Dtos.PaqueteDto;
using ProyTour_Transporte_Hospedaje.Dtos.PaqueteDto.Detalle;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Controllers
{
    [Route("api/[controller]")] // Ruta: /api/Paquete
    [ApiController]
    public class PaqueteController : ControllerBase
    {
        private readonly IPaqueteRepository _repositorio;
        private readonly IImagenRepository _imagenRepositorio;
        private readonly ViajeTourContext _context;

        public PaqueteController(IPaqueteRepository repositorio, IImagenRepository imagenRepositorio, ViajeTourContext context)
        {
            _repositorio = repositorio;
            _imagenRepositorio = imagenRepositorio;
            _context = context;
        }

        private async Task<PaqueteReadDto> MapearPaqueteADtoAsync(Paquete paqueteConDetalles)
        {
            // Construir los detalles del servicio con sus imágenes
            var serviciosDto = new List<PaqueteDetalleReadDto>();

            foreach (var pd in paqueteConDetalles.PaqueteDetalles)
            {
                var servicioDto = new PaqueteDetalleReadDto
                {
                    IdServicio = pd.IdServicio,
                    TipoServicio = pd.IdServicioNavigation.TipoServicio,
                    NombreServicio = pd.IdServicioNavigation.Nombre,
                    PrecioBase = pd.IdServicioNavigation.PrecioBase
                };

                // Obtener el ID específico de la entidad (Hospedaje, Tour o Transporte)
                int? idEntidad = null;
                string tipoEntidad = pd.IdServicioNavigation.TipoServicio.ToUpper();

                if (tipoEntidad == "HOSPEDAJE")
                {
                    var hospedaje = await _context.Hospedaje
                        .FirstOrDefaultAsync(h => h.IdServicio == pd.IdServicio);
                    if (hospedaje != null) idEntidad = hospedaje.IdHospedaje;
                }
                else if (tipoEntidad == "TOUR")
                {
                    var tour = await _context.Tour
                        .FirstOrDefaultAsync(t => t.IdServicio == pd.IdServicio);
                    if (tour != null) idEntidad = tour.IdTour;
                }
                else if (tipoEntidad == "TRANSPORTE")
                {
                    var transporte = await _context.Transporte
                        .FirstOrDefaultAsync(tr => tr.IdServicio == pd.IdServicio);
                    if (transporte != null) idEntidad = transporte.IdTransporte;
                }

                // Obtener imágenes del servicio si tiene ID de entidad
                if (idEntidad.HasValue)
                {
                    servicioDto.Imagenes = (await _imagenRepositorio.ObtenerPorEntidadAsync(tipoEntidad, idEntidad.Value)).ToList();
                }

                serviciosDto.Add(servicioDto);
            }

            return new PaqueteReadDto
            {
                IdPaquete = paqueteConDetalles.IdPaquete,
                Nombre = paqueteConDetalles.Nombre,
                Descripcion = paqueteConDetalles.Descripcion,
                PrecioTotal = paqueteConDetalles.PrecioTotal,
                EsPromocion = (bool)paqueteConDetalles.EsPromocion!,
                Servicios = serviciosDto
            };
        }


        // GET: /api/Paquete (Listar todos - PÚBLICO)
        // Nota: El listado devuelve solo información básica (servicios e imágenes vacíos)
        // Para obtener detalles completos, usar GET /api/Paquete/{id}
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaqueteReadDto>>> GetPaquetes()
        {
            var paquetesDto = await _repositorio.ObtenerTodosDtoAsync();

            if (paquetesDto == null || !paquetesDto.Any())
            {
                return NotFound("No se encontraron paquetes.");
            }
            return Ok(paquetesDto);
        }


        // GET: /api/Paquete/5 (Detalle por ID - PÚBLICO)

        [HttpGet("{id}")]
        public async Task<ActionResult<PaqueteReadDto>> GetPaquete(int id)
        {
            var paqueteConDetalles = await _repositorio.ObtenerPorIdAsync(id);

            if (paqueteConDetalles == null)
            {
                return NotFound($"Paquete con ID {id} no encontrado.");
            }

            // Mapeo manual a DTO con imágenes incluidas
            var paqueteReadDto = await MapearPaqueteADtoAsync(paqueteConDetalles);

            return Ok(paqueteReadDto);
        }

        // POST: /api/Paquete (Crear Nuevo - PROTEGIDO)
      
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<PaqueteReadDto>> PostPaquete([FromBody] PaqueteCreateDto paqueteDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 1. Validación de Servicios (Deben existir en la tabla Servicio)
            if (paqueteDto.Servicios == null || !paqueteDto.Servicios.Any())
            {
                return BadRequest(new { message = "El paquete debe contener al menos un servicio." });
            }

            foreach (var servicioItem in paqueteDto.Servicios)
            {
                if (!await _repositorio.ExisteServicioAsync(servicioItem.IdServicio))
                {
                    return BadRequest(new { message = $"El Servicio con ID {servicioItem.IdServicio} no existe." });
                }
            }

            // 2. Creación del modelo Paquete (Mapeo manual)
            var paqueteModel = new Paquete
            {
                Nombre = paqueteDto.Nombre,
                Descripcion = paqueteDto.Descripcion,
                PrecioTotal = paqueteDto.PrecioTotal,
                EsPromocion = paqueteDto.EsPromocion,
                // Mapeamos la colección de detalles (tabla Paquete_Detalle)
                PaqueteDetalles = paqueteDto.Servicios.Select(s => new PaqueteDetalle
                {
                    IdServicio = s.IdServicio
                }).ToList()
            };

            await _repositorio.CrearPaqueteAsync(paqueteModel);

            if (await _repositorio.GuardarCambiosAsync())
            {

                var paqueteConDetalles = await _repositorio.ObtenerPorIdAsync(paqueteModel.IdPaquete);

                // 5. Mapeo manual a DTO con imágenes incluidas
                var paqueteReadDto = await MapearPaqueteADtoAsync(paqueteConDetalles!);

                return CreatedAtAction(nameof(GetPaquete), // Usamos GetPaquete (singular)
                    new { id = paqueteReadDto.IdPaquete }, paqueteReadDto);
            }
            return StatusCode(500, "Error al guardar el nuevo paquete.");
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdatePaquete(int id, [FromBody] PaqueteCreateDto paqueteDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 1. Validación de Servicios (FKs)
            if (paqueteDto.Servicios == null || !paqueteDto.Servicios.Any())
            {
                return BadRequest(new { message = "El paquete debe contener al menos un servicio." });
            }

            foreach (var servicioItem in paqueteDto.Servicios)
            {
                if (!await _repositorio.ExisteServicioAsync(servicioItem.IdServicio))
                {
                    return BadRequest(new { message = $"El Servicio con ID {servicioItem.IdServicio} no existe." });
                }
            }

            var paqueteExistente = await _repositorio.ObtenerPorIdAsync(id);
            if (paqueteExistente == null)
            {
                return NotFound($"Paquete con ID {id} no encontrado.");
            }

            // 3. Mapeo Manual: Actualizar propiedades básicas
            paqueteExistente.Nombre = paqueteDto.Nombre;
            paqueteExistente.Descripcion = paqueteDto.Descripcion;
            paqueteExistente.PrecioTotal = paqueteDto.PrecioTotal;
            paqueteExistente.EsPromocion = paqueteDto.EsPromocion;


            paqueteExistente.PaqueteDetalles.Clear();

            foreach (var servicioItem in paqueteDto.Servicios)
            {
                paqueteExistente.PaqueteDetalles.Add(new PaqueteDetalle
                {
                    IdPaquete = id,
                    IdServicio = servicioItem.IdServicio
                });
            }

            // 5. Guardar los cambios
            _repositorio.Actualizar(paqueteExistente);

            if (await _repositorio.GuardarCambiosAsync())
            {
                return NoContent(); // 204 No Content
            }

            return StatusCode(500, "Error al actualizar el paquete.");
        }

        // DELETE: /api/Paquete/5 (Eliminar - PROTEGIDO)

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeletePaquete(int id)
        {
            var paqueteExistente = await _repositorio.ObtenerPorIdAsync(id);
            if (paqueteExistente == null)
            {
                return NotFound($"Paquete con ID {id} no encontrado.");
            }

            _repositorio.Eliminar(paqueteExistente);

            if (await _repositorio.GuardarCambiosAsync())
            {
                return NoContent(); 
            }

            return StatusCode(500, "Error al eliminar el paquete.");
        }
    }
}
