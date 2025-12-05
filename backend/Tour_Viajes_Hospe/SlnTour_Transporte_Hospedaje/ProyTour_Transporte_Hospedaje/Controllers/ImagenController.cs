using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProyTour_Transporte_Hospedaje.Dtos.ImagenDto;
using ProyTour_Transporte_Hospedaje.Interfaces;

namespace ProyTour_Transporte_Hospedaje.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagenController : ControllerBase
    {
        private readonly IImagenRepository _repositorio;

        public ImagenController(IImagenRepository repositorio)
        {
            _repositorio = repositorio;
        }

        // ==========================================================
        // GET: /api/Imagen/{tipoEntidad}/{idEntidad}
        // Ejemplo: /api/Imagen/HOSPEDAJE/5
        // ==========================================================
        [HttpGet("{tipoEntidad}/{idEntidad}")]
        public async Task<ActionResult<IEnumerable<ImagenReadDto>>> GetImagenesPorEntidad(
            string tipoEntidad, 
            int idEntidad)
        {
            // Validar tipo de entidad
            var tipoUpper = tipoEntidad.ToUpper();
            if (tipoUpper != "HOSPEDAJE" && tipoUpper != "TOUR" && 
                tipoUpper != "TRANSPORTE" && tipoUpper != "PAQUETE")
            {
                return BadRequest("Tipo de entidad inválido. Use: HOSPEDAJE, TOUR, TRANSPORTE o PAQUETE");
            }

            var imagenes = await _repositorio.ObtenerPorEntidadAsync(tipoUpper, idEntidad);

            if (!imagenes.Any())
            {
                return NotFound($"No se encontraron imágenes para {tipoUpper} con ID {idEntidad}.");
            }

            return Ok(imagenes);
        }

        // ==========================================================
        // GET: /api/Imagen/{id}
        // Obtener una imagen específica por ID
        // ==========================================================
        [HttpGet("{id}")]
        public async Task<ActionResult<ImagenReadDto>> GetImagen(int id)
        {
            var imagen = await _repositorio.ObtenerPorIdAsync(id);

            if (imagen == null)
            {
                return NotFound($"Imagen con ID {id} no encontrada.");
            }

            var imagenDto = new ImagenReadDto
            {
                IdImagen = imagen.IdImagen,
                TipoEntidad = imagen.TipoEntidad,
                IdEntidad = imagen.IdEntidad,
                Url = imagen.Url,
                Descripcion = imagen.Descripcion
            };

            return Ok(imagenDto);
        }

        // ==========================================================
        // POST: /api/Imagen (Crear nueva imagen - PROTEGIDO)
        // ==========================================================
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<ImagenReadDto>> PostImagen([FromBody] ImagenCreateDto imagenDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validar tipo de entidad
            var tipoUpper = imagenDto.TipoEntidad.ToUpper();
            if (tipoUpper != "HOSPEDAJE" && tipoUpper != "TOUR" && 
                tipoUpper != "TRANSPORTE" && tipoUpper != "PAQUETE")
            {
                return BadRequest("Tipo de entidad inválido. Use: HOSPEDAJE, TOUR, TRANSPORTE o PAQUETE");
            }

            var imagenModel = new Models.Imagen
            {
                TipoEntidad = tipoUpper,
                IdEntidad = imagenDto.IdEntidad,
                Url = imagenDto.Url,
                Descripcion = imagenDto.Descripcion
            };

            await _repositorio.CrearAsync(imagenModel);

            if (await _repositorio.GuardarCambiosAsync())
            {
                var imagenReadDto = new ImagenReadDto
                {
                    IdImagen = imagenModel.IdImagen,
                    TipoEntidad = imagenModel.TipoEntidad,
                    IdEntidad = imagenModel.IdEntidad,
                    Url = imagenModel.Url,
                    Descripcion = imagenModel.Descripcion
                };

                return CreatedAtAction(nameof(GetImagen), 
                    new { id = imagenReadDto.IdImagen }, imagenReadDto);
            }

            return StatusCode(500, "Error al guardar la imagen.");
        }

        // ==========================================================
        // DELETE: /api/Imagen/{id} (Eliminar imagen - PROTEGIDO)
        // ==========================================================
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteImagen(int id)
        {
            var imagenExistente = await _repositorio.ObtenerPorIdAsync(id);

            if (imagenExistente == null)
            {
                return NotFound($"Imagen con ID {id} no encontrada.");
            }

            _repositorio.Eliminar(imagenExistente);

            if (await _repositorio.GuardarCambiosAsync())
            {
                return NoContent(); // 204 No Content
            }

            return StatusCode(500, "Error al eliminar la imagen.");
        }
    }
}

