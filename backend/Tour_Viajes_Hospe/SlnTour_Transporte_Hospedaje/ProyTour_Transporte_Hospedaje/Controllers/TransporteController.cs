using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProyTour_Transporte_Hospedaje.Dtos.TransporteDto;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Controllers
{
    [Route("api/[controller]")] // Ruta: /api/Transporte
    [ApiController]
    public class TransporteController : ControllerBase
    {
        private readonly ITransporteRepository _repositorio;
        private readonly IDestinoRepository _destinoRepositorio;
        private readonly IImagenRepository _imagenRepositorio;

        public TransporteController(ITransporteRepository repositorio, IDestinoRepository destinoRepositorio, IImagenRepository imagenRepositorio)
        {
            _repositorio = repositorio;
            _destinoRepositorio = destinoRepositorio;
            _imagenRepositorio = imagenRepositorio;
        }

        // --- Mapeo Manual a DTO con imágenes (Reutilizable para las respuestas)
        private async Task<TransporteReadDto> MapearTransporteADtoAsync(Transporte transporteConRelaciones)
        {
            var deptoOrigenNombre = transporteConRelaciones.IdOrigenNavigation.IdDepartamentoNavigation?.NombreDepartamento ?? "N/A";
            var deptoDestinoNombre = transporteConRelaciones.IdDestinoNavigation.IdDepartamentoNavigation?.NombreDepartamento ?? "N/A";

            // Obtener imágenes del transporte
            var imagenes = await _imagenRepositorio.ObtenerPorEntidadAsync("TRANSPORTE", transporteConRelaciones.IdTransporte);

            return new TransporteReadDto
            {
                IdServicio = transporteConRelaciones.IdServicio,
                IdTransporte = transporteConRelaciones.IdTransporte,

                Nombre = transporteConRelaciones.IdServicioNavigation.Nombre,
                Descripcion = transporteConRelaciones.IdServicioNavigation.Descripcion,
                PrecioBase = transporteConRelaciones.IdServicioNavigation.PrecioBase,

                Categoria = transporteConRelaciones.Categoria,
                FechaSalida = transporteConRelaciones.FechaSalida,
                FechaLlegada = transporteConRelaciones.FechaLlegada,

                IdOrigen = transporteConRelaciones.IdOrigen,
                NombreOrigen = transporteConRelaciones.IdOrigenNavigation.NombreDestino,
                NombreDepartamentoOrigen = deptoOrigenNombre,

                IdDestino = transporteConRelaciones.IdDestino,
                NombreDestino = transporteConRelaciones.IdDestinoNavigation.NombreDestino,
                NombreDepartamentoDestino = deptoDestinoNombre,
                Imagenes = imagenes.ToList()
            };
        }

        // ==========================================================
        // GET: /api/Transporte (Listar todos - PÚBLICO)
        // ==========================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransporteReadDto>>> GetTransportes()
        {
            var transportesDto = await _repositorio.ObtenerTodosDtoAsync();

            if (transportesDto == null || !transportesDto.Any())
            {
                return NotFound("No se encontraron transportes.");
            }

            // Cargar imágenes para cada transporte
            var transportesConImagenes = new List<TransporteReadDto>();
            foreach (var transporte in transportesDto)
            {
                var imagenes = await _imagenRepositorio.ObtenerPorEntidadAsync("TRANSPORTE", transporte.IdTransporte);
                transporte.Imagenes = imagenes.ToList();
                transportesConImagenes.Add(transporte);
            }

            return Ok(transportesConImagenes);
        }

        // ==========================================================
        // POST: /api/Transporte (Crear Nuevo - PROTEGIDO)
        // ==========================================================
        [HttpPost]
        [Authorize(Roles = "ADMIN, EMPLEADO")]
        public async Task<ActionResult<TransporteReadDto>> PostTransporte([FromBody] TransporteCreateDto transporteDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 1. Validación de Origen y Destino
            if (await _destinoRepositorio.ObtenerPorIdAsync(transporteDto.IdOrigen) == null)
            {
                return BadRequest(new { message = $"El Destino de Origen con ID {transporteDto.IdOrigen} no existe." });
            }
            if (await _destinoRepositorio.ObtenerPorIdAsync(transporteDto.IdDestino) == null)
            {
                return BadRequest(new { message = $"El Destino Final con ID {transporteDto.IdDestino} no existe." });
            }

            // 2. Creación de las dos entidades
            var servicioModel = new Servicio
            {
                TipoServicio = "TRANSPORTE",
                Nombre = transporteDto.Nombre,
                Descripcion = transporteDto.Descripcion,
                PrecioBase = transporteDto.PrecioBase
            };

            var transporteModel = new Transporte
            {
                IdOrigen = transporteDto.IdOrigen,
                IdDestino = transporteDto.IdDestino,
                Categoria = transporteDto.Categoria,
                FechaSalida = transporteDto.FechaSalida,
                FechaLlegada = transporteDto.FechaLlegada,
            };

            // 3. Guardar en ambas tablas
            await _repositorio.CrearTransporteAsync(servicioModel, transporteModel);

            if (await _repositorio.GuardarCambiosAsync())
            {
                // 4. Obtener el modelo guardado con todas las navegaciones cargadas
                var transporteConRelaciones = await _repositorio.ObtenerPorIdAsync(transporteModel.IdTransporte);

                // 5. Mapeo manual a DTO y respuesta
                var responseDto = await MapearTransporteADtoAsync(transporteConRelaciones!);

                return CreatedAtAction(nameof(GetTransportes),
                    new { id = responseDto.IdTransporte }, responseDto);
            }
            return StatusCode(500, "Error al guardar el nuevo transporte.");
        }

        // ==========================================================
        // PUT: /api/Transporte/5 (Actualizar - PROTEGIDO)
        // ==========================================================
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateTransporte(int id, [FromBody] TransporteCreateDto transporteDto) // Usamos CreateDto para el PUT por ser idéntico
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 1. Buscar la entidad existente
            var transporteExistente = await _repositorio.ObtenerPorIdAsync(id);
            if (transporteExistente == null)
            {
                return NotFound($"Transporte con ID {id} no encontrado.");
            }

            // 2. Buscar las entidades relacionadas
            var servicioExistente = transporteExistente.IdServicioNavigation;

            // 3. Mapeo Manual: Actualizar las propiedades en los modelos de DB
            servicioExistente.Nombre = transporteDto.Nombre;
            servicioExistente.Descripcion = transporteDto.Descripcion;
            servicioExistente.PrecioBase = transporteDto.PrecioBase;

            transporteExistente.IdOrigen = transporteDto.IdOrigen;
            transporteExistente.IdDestino = transporteDto.IdDestino;
            transporteExistente.Categoria = transporteDto.Categoria;
            transporteExistente.FechaSalida = transporteDto.FechaSalida;
            transporteExistente.FechaLlegada = transporteDto.FechaLlegada;

            // 4. Actualizar y Guardar
            _repositorio.Actualizar(servicioExistente, transporteExistente);

            if (await _repositorio.GuardarCambiosAsync())
            {
                return NoContent(); // 204 No Content
            }

            return StatusCode(500, "Error al actualizar el transporte.");
        }

        // ==========================================================
        // DELETE: /api/Transporte/5 (Eliminar - PROTEGIDO)
        // ==========================================================
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteTransporte(int id)
        {
            // 1. Buscar la entidad existente
            var transporteExistente = await _repositorio.ObtenerPorIdAsync(id);
            if (transporteExistente == null)
            {
                return NotFound($"Transporte con ID {id} no encontrado.");
            }

            // 2. Buscar las entidades relacionadas
            var servicioExistente = transporteExistente.IdServicioNavigation;

            // 3. Eliminar ambas entidades y Guardar
            _repositorio.Eliminar(servicioExistente, transporteExistente);

            if (await _repositorio.GuardarCambiosAsync())
            {
                return NoContent(); // 204 No Content
            }

            return StatusCode(500, "Error al eliminar el transporte.");
        }
    }
}
