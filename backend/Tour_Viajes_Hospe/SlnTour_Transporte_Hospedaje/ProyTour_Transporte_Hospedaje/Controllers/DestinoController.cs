using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProyTour_Transporte_Hospedaje.Dtos.DestinoDto;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Controllers
{
    [Route("api/[controller]")] // Ruta: /api/Destino
    [ApiController]
    public class DestinoController : ControllerBase
    {
        private readonly IDestinoRepository _repositorio;
        private readonly IMapper _mapper;

        public DestinoController(IDestinoRepository repositorio, IMapper mapper)
        {
            _repositorio = repositorio;
            _mapper = mapper;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DestinoReadDto>>> GetDestinos()
        {
            var destinosDb = await _repositorio.ObtenerTodosAsync(); 

            if (destinosDb == null || !destinosDb.Any())
            {
                return NotFound("No se encontraron destinos.");
            }

            var destinosDto = _mapper.Map<IEnumerable<DestinoReadDto>>(destinosDb);

            return Ok(destinosDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Destino>> GetDestino(int id)
        {
            var destino = await _repositorio.ObtenerPorIdAsync(id);

            if (destino == null)
            {
                return NotFound($"Destino con ID {id} no encontrado.");
            }

            return Ok(destino);
        }


        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<DestinoReadDto>> PostDestino([FromBody] DestinoCreateDto destinoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var destinoModel = new Destino
            {
                NombreDestino = destinoDto.NombreDestino,
                Descripcion = destinoDto.Descripcion,
                IdDepartamento = destinoDto.IdDepartamento
            };

            await _repositorio.CrearAsync(destinoModel);

            if (await _repositorio.GuardarCambiosAsync())
            {
                var destinoConDepto = await _repositorio.ObtenerPorIdAsync(destinoModel.IdDestino);

    
                var destinoReadDto = new DestinoReadDto
                {
                    IdDestino = destinoModel.IdDestino,
                    NombreDestino = destinoModel.NombreDestino,
                    Descripcion = destinoModel.Descripcion,
                    IdDepartamento = destinoModel.IdDepartamento,
                    NombreDepartamento = destinoConDepto.IdDepartamentoNavigation?.NombreDepartamento ?? ""
                };

                // 4. Devolver 201 Created
                return CreatedAtAction(nameof(GetDestino),
                    new { id = destinoReadDto.IdDestino }, destinoReadDto);
            }

            return StatusCode(500, "Error al guardar el destino.");
        }
    }
}
