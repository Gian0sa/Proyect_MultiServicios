using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProyTour_Transporte_Hospedaje.Dtos.HospedajeDto;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Controllers
{
    [Route("api/[controller]")] // Ruta: /api/Hospedaje
    [ApiController]
    public class HospedajeController : ControllerBase
    {
        private readonly IHospedajeRepository _repositorio;
        private readonly IDestinoRepository _destinoRepositorio; // Para validaciones de FK
        private readonly IImagenRepository _imagenRepositorio;

        public HospedajeController(IHospedajeRepository repositorio, IDestinoRepository destinoRepositorio, IImagenRepository imagenRepositorio)
        {
            _repositorio = repositorio;
            _destinoRepositorio = destinoRepositorio;
            _imagenRepositorio = imagenRepositorio;
        }

        // --- Mapeo Manual a DTO con imágenes (Sección reutilizable para el GET y la respuesta del POST/PUT)
        private async Task<HospedajeReadDto> MapearHospedajeADtoAsync(Hospedaje hospedajeConRelaciones)
        {
            // Usamos el operador ?. para seguridad si alguna relación es nula
            var deptoNombre = hospedajeConRelaciones.IdDestinoNavigation.IdDepartamentoNavigation?.NombreDepartamento ?? "N/A";

            // Obtener imágenes del hospedaje
            var imagenes = await _imagenRepositorio.ObtenerPorEntidadAsync("HOSPEDAJE", hospedajeConRelaciones.IdHospedaje);

            return new HospedajeReadDto
            {
                IdServicio = hospedajeConRelaciones.IdServicio,
                IdHospedaje = hospedajeConRelaciones.IdHospedaje,
                Nombre = hospedajeConRelaciones.IdServicioNavigation.Nombre,
                Descripcion = hospedajeConRelaciones.IdServicioNavigation.Descripcion,
                PrecioBase = hospedajeConRelaciones.IdServicioNavigation.PrecioBase,
                RangoPrecio = hospedajeConRelaciones.RangoPrecio,
                Capacidad = (int)hospedajeConRelaciones.Capacidad!,
                ServiciosIncluidos = hospedajeConRelaciones.ServiciosIncluidos,
                IdDestino = hospedajeConRelaciones.IdDestino,
                NombreDestino = hospedajeConRelaciones.IdDestinoNavigation.NombreDestino,
                NombreDepartamento = deptoNombre,
                Imagenes = imagenes.ToList()
            };
        }

        // ==========================================================
        // GET: /api/Hospedaje (Listar todos - PÚBLICO)
        // ==========================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HospedajeReadDto>>> GetHospedajes()
        {
            var hospedajesDto = await _repositorio.ObtenerTodosDtoAsync();

            if (hospedajesDto == null || !hospedajesDto.Any())
            {
                return NotFound("No se encontraron hospedajes.");
            }

            // Cargar imágenes para cada hospedaje
            var hospedajesConImagenes = new List<HospedajeReadDto>();
            foreach (var hospedaje in hospedajesDto)
            {
                var imagenes = await _imagenRepositorio.ObtenerPorEntidadAsync("HOSPEDAJE", hospedaje.IdHospedaje);
                hospedaje.Imagenes = imagenes.ToList();
                hospedajesConImagenes.Add(hospedaje);
            }

            return Ok(hospedajesConImagenes);
        }

        // ==========================================================
        // POST: /api/Hospedaje (Crear Nuevo - PROTEGIDO)
        // ==========================================================
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<HospedajeReadDto>> PostHospedaje([FromBody] HospedajeCreateDto hospedajeDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 1. Validación: El Destino debe existir
            if (await _destinoRepositorio.ObtenerPorIdAsync(hospedajeDto.IdDestino) == null)
            {
                return BadRequest(new { message = $"El Destino con ID {hospedajeDto.IdDestino} no existe." });
            }

            // 2. Creación de las dos entidades
            var servicioModel = new Servicio
            {
                TipoServicio = "HOSPEDAJE",
                Nombre = hospedajeDto.Nombre,
                Descripcion = hospedajeDto.Descripcion,
                PrecioBase = hospedajeDto.PrecioBase
            };

            var hospedajeModel = new Hospedaje
            {
                IdDestino = hospedajeDto.IdDestino,
                RangoPrecio = hospedajeDto.RangoPrecio,
                Capacidad = hospedajeDto.Capacidad,
                ServiciosIncluidos = hospedajeDto.ServiciosIncluidos,
            };

            await _repositorio.CrearHospedajeAsync(servicioModel, hospedajeModel);

            if (await _repositorio.GuardarCambiosAsync())
            {
                // 3. Obtener el modelo guardado con todas las navegaciones cargadas
                var hospedajeConRelaciones = await _repositorio.ObtenerPorIdAsync(hospedajeModel.IdHospedaje);

                // 4. Mapeo manual a DTO con imágenes
                var responseDto = await MapearHospedajeADtoAsync(hospedajeConRelaciones!);

                return CreatedAtAction(nameof(GetHospedajes),
                    new { id = responseDto.IdHospedaje }, responseDto);
            }
            return StatusCode(500, "Error al guardar el nuevo hospedaje.");
        }

        // ==========================================================
        // PUT: /api/Hospedaje/5 (Actualizar - PROTEGIDO)
        // ==========================================================
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateHospedaje(int id, [FromBody] HospedajeUpdateDto hospedajeDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 1. Buscar la entidad existente
            var hospedajeExistente = await _repositorio.ObtenerPorIdAsync(id);
            if (hospedajeExistente == null)
            {
                return NotFound($"Hospedaje con ID {id} no encontrado.");
            }

            // 2. Buscar las entidades relacionadas
            var servicioExistente = hospedajeExistente.IdServicioNavigation;

            // 3. Mapeo Manual: Actualizar las propiedades en los modelos de DB
            servicioExistente.Nombre = hospedajeDto.Nombre;
            servicioExistente.Descripcion = hospedajeDto.Descripcion;
            servicioExistente.PrecioBase = hospedajeDto.PrecioBase;

            hospedajeExistente.IdDestino = hospedajeDto.IdDestino;
            hospedajeExistente.RangoPrecio = hospedajeDto.RangoPrecio;
            hospedajeExistente.Capacidad = hospedajeDto.Capacidad;
            hospedajeExistente.ServiciosIncluidos = hospedajeDto.ServiciosIncluidos;

            // 4. Actualizar y Guardar
            _repositorio.Actualizar(servicioExistente, hospedajeExistente);

            if (await _repositorio.GuardarCambiosAsync())
            {
                return NoContent(); // 204 No Content
            }

            return StatusCode(500, "Error al actualizar el hospedaje.");
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteHospedaje(int id)
        {
            // 1. Buscar la entidad existente
            var hospedajeExistente = await _repositorio.ObtenerPorIdAsync(id);
            if (hospedajeExistente == null)
            {
                return NotFound($"Hospedaje con ID {id} no encontrado.");
            }

            // 2. Buscar las entidades relacionadas
            var servicioExistente = hospedajeExistente.IdServicioNavigation;

            // 3. Eliminar ambas entidades y Guardar
            _repositorio.Eliminar(servicioExistente, hospedajeExistente);

            if (await _repositorio.GuardarCambiosAsync())
            {
                return NoContent(); // 204 No Content
            }

            return StatusCode(500, "Error al eliminar el hospedaje.");
        }
    }
}
