using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProyTour_Transporte_Hospedaje.Dtos;
using ProyTour_Transporte_Hospedaje.Dtos.TourDto;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;
using System.Linq;

namespace ProyTour_Transporte_Hospedaje.Controllers
{
    [Route("api/[controller]")] // Ruta: /api/Tour
    [ApiController]
    public class TourController : ControllerBase
    {
        private readonly ITourRepository _repositorio;
        private readonly IDestinoRepository _destinoRepositorio; // Para validaciones de FK
        private readonly IImagenRepository _imagenRepositorio;

        public TourController(ITourRepository repositorio, IDestinoRepository destinoRepositorio, IImagenRepository imagenRepositorio)
        {
            _repositorio = repositorio;
            _destinoRepositorio = destinoRepositorio;
            _imagenRepositorio = imagenRepositorio;
        }

        // --- Mapeo Manual a DTO con imágenes (Sección reutilizable para el GET {id} y la respuesta del POST/PUT)
        private async Task<TourReadDto> MapearTourADtoAsync(Tour tourConRelaciones)
        {
            // Usamos el operador ?. para seguridad si alguna relación es nula
            var deptoNombre = tourConRelaciones.IdDestinoNavigation.IdDepartamentoNavigation?.NombreDepartamento ?? "N/A";

            // Obtener imágenes del tour
            var imagenes = await _imagenRepositorio.ObtenerPorEntidadAsync("TOUR", tourConRelaciones.IdTour);

            return new TourReadDto
            {
                IdServicio = tourConRelaciones.IdServicio,
                IdTour = tourConRelaciones.IdTour,

                Nombre = tourConRelaciones.IdServicioNavigation.Nombre,
                Descripcion = tourConRelaciones.IdServicioNavigation.Descripcion,
                PrecioBase = tourConRelaciones.IdServicioNavigation.PrecioBase,

                Duracion = tourConRelaciones.Duracion,
                GuiaIncluido = (bool)tourConRelaciones.GuiaIncluido!,

                IdDestino = tourConRelaciones.IdDestino,
                NombreDestino = tourConRelaciones.IdDestinoNavigation.NombreDestino,
                NombreDepartamento = deptoNombre,
                Imagenes = imagenes.ToList()
            };
        }

        // ==========================================================
        // GET: /api/Tour (Listar todos - PÚBLICO)
        // ==========================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TourReadDto>>> GetTours()
        {
            var toursDto = await _repositorio.ObtenerTodosDtoAsync();

            if (toursDto == null || !toursDto.Any())
            {
                return NotFound("No se encontraron tours.");
            }

            // Cargar imágenes para cada tour
            var toursConImagenes = new List<TourReadDto>();
            foreach (var tour in toursDto)
            {
                var imagenes = await _imagenRepositorio.ObtenerPorEntidadAsync("TOUR", tour.IdTour);
                tour.Imagenes = imagenes.ToList();
                toursConImagenes.Add(tour);
            }

            return Ok(toursConImagenes);
        }

        // ==========================================================
        // GET: /api/Tour/5 (Detalle por ID - PÚBLICO)
        // ==========================================================
        [HttpGet("{id}")]
        public async Task<ActionResult<TourReadDto>> GetTour(int id)
        {
            var tourConRelaciones = await _repositorio.ObtenerPorIdAsync(id);

            if (tourConRelaciones == null)
            {
                return NotFound($"Tour con ID {id} no encontrado.");
            }

            var responseDto = await MapearTourADtoAsync(tourConRelaciones);

            return Ok(responseDto);
        }

        // ==========================================================
        // POST: /api/Tour (Crear Nuevo - PROTEGIDO)
        // ==========================================================
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<TourReadDto>> PostTour([FromBody] TourCreateDto tourDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 1. Validación: El Destino debe existir
            if (await _destinoRepositorio.ObtenerPorIdAsync(tourDto.IdDestino) == null)
            {
                return BadRequest(new { message = $"El Destino con ID {tourDto.IdDestino} no existe." });
            }

            // 2. Creación de las dos entidades
            var servicioModel = new Servicio
            {
                TipoServicio = "TOUR", // Valor Fijo
                Nombre = tourDto.Nombre,
                Descripcion = tourDto.Descripcion,
                PrecioBase = tourDto.PrecioBase
            };

            var tourModel = new Tour
            {
                IdDestino = tourDto.IdDestino,
                Duracion = tourDto.Duracion,
                GuiaIncluido = tourDto.GuiaIncluido,
            };

            // 3. Guardar en ambas tablas
            await _repositorio.CrearTourAsync(servicioModel, tourModel);

            if (await _repositorio.GuardarCambiosAsync())
            {
                // 4. Obtener el modelo guardado con todas las navegaciones cargadas
                var tourConRelaciones = await _repositorio.ObtenerPorIdAsync(tourModel.IdTour);

                // 5. Mapeo manual a DTO y respuesta
                var responseDto = await MapearTourADtoAsync(tourConRelaciones!);

                return CreatedAtAction(nameof(GetTour), // Cambiamos a GetTour (singular)
                    new { id = responseDto.IdTour }, responseDto);
            }
            return StatusCode(500, "Error al guardar el nuevo tour.");
        }

        // ==========================================================
        // PUT: /api/Tour/5 (Actualizar - PROTEGIDO)
        // ==========================================================
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN, EMPLEADO")]
        public async Task<IActionResult> UpdateTour(int id, [FromBody] TourUpdateDto tourDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 1. Buscar la entidad existente
            var tourExistente = await _repositorio.ObtenerPorIdAsync(id);
            if (tourExistente == null)
            {
                return NotFound($"Tour con ID {id} no encontrado.");
            }

            // 2. Buscar las entidades relacionadas
            var servicioExistente = tourExistente.IdServicioNavigation;

            // 3. Mapeo Manual: Actualizar las propiedades en los modelos de DB
            servicioExistente.Nombre = tourDto.Nombre;
            servicioExistente.Descripcion = tourDto.Descripcion;
            servicioExistente.PrecioBase = tourDto.PrecioBase;

            tourExistente.IdDestino = tourDto.IdDestino;
            tourExistente.Duracion = tourDto.Duracion;
            tourExistente.GuiaIncluido = tourDto.GuiaIncluido;

            // 4. Actualizar y Guardar
            _repositorio.Actualizar(servicioExistente, tourExistente);

            if (await _repositorio.GuardarCambiosAsync())
            {
                return NoContent(); // 204 No Content
            }

            return StatusCode(500, "Error al actualizar el tour.");
        }

        // ==========================================================
        // DELETE: /api/Tour/5 (Eliminar - PROTEGIDO)
        // ==========================================================
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteTour(int id)
        {
            // 1. Buscar la entidad existente
            var tourExistente = await _repositorio.ObtenerPorIdAsync(id);
            if (tourExistente == null)
            {
                return NotFound($"Tour con ID {id} no encontrado.");
            }

            // 2. Buscar las entidades relacionadas
            var servicioExistente = tourExistente.IdServicioNavigation;

            // 3. Eliminar ambas entidades y Guardar
            _repositorio.Eliminar(servicioExistente, tourExistente);

            if (await _repositorio.GuardarCambiosAsync())
            {
                return NoContent(); // 204 No Content
            }

            return StatusCode(500, "Error al eliminar el tour.");
        }
    }
}