using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq; // Necesario para .Any()
using KillasTravel.Application.DTOs;
using KillasTravel.Application.Interfaces;
using KillasTravel.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using AutoMapper; // AÑADIR: Para usar el mapeador

[ApiController]
[Route("api/[controller]")] // La ruta será /api/Alojamientos
public class AlojamientosController : ControllerBase
{
    private readonly IAlojamientoRepository _alojamientoRepository;
    private readonly IMapper _mapper; // NUEVO: Declaración del Mapper

    // Inyección de Dependencias
    public AlojamientosController(IAlojamientoRepository alojamientoRepository, IMapper mapper) // NUEVO: Inyectar IMapper
    {
        _alojamientoRepository = alojamientoRepository;
        _mapper = mapper; // Asignar el mapper
    }

    // --- 1. GET: TODOS ---
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AlojamientoResponseDto>>> Get() // Cambiar el tipo de retorno a DTO
    {
        var alojamientos = await _alojamientoRepository.GetAllAsync();

        // Mapear la lista de entidades a la lista de DTOs
        var dtos = _mapper.Map<IEnumerable<AlojamientoResponseDto>>(alojamientos);

        return Ok(dtos);
    }

    // --- 2. GET: POR ID ---
    [HttpGet("{id}")]
    public async Task<ActionResult<AlojamientoResponseDto>> Get(int id) // Cambiar el tipo de retorno a DTO
    {
        var alojamiento = await _alojamientoRepository.GetByIdAsync(id);

        if (alojamiento == null)
        {
            return NotFound();
        }

        // Mapear la entidad individual a un DTO
        var dto = _mapper.Map<AlojamientoResponseDto>(alojamiento);

        return Ok(dto);
    }

    // --- 3. GET: POR REGIÓN ---
    [HttpGet("ByRegion/{regionId}")]
    public async Task<ActionResult<IEnumerable<AlojamientoResponseDto>>> GetByRegion(int regionId) // Cambiar el tipo de retorno a DTO
    {
        var alojamientos = await _alojamientoRepository.GetByRegionIdAsync(regionId);

        if (!alojamientos.Any())
        {
            return NotFound($"No se encontraron alojamientos para la región ID {regionId}.");
        }

        // Mapear la lista de entidades a la lista de DTOs
        var dtos = _mapper.Map<IEnumerable<AlojamientoResponseDto>>(alojamientos);

        return Ok(dtos);
    }

    // --- 4. GET: POR RANGO DE PRECIO (Ya usaba DTO) ---
    [HttpGet("ByPriceRange")]
    public async Task<ActionResult<IEnumerable<AlojamientoResponseDto>>> GetByPriceRange(
    [FromQuery] decimal minPrice,
    [FromQuery] decimal maxPrice)
    {
        // ... (Tu lógica de filtrado existente) ...

        var alojamientos = await _alojamientoRepository.GetByPriceRangeAsync(minPrice, maxPrice);

        // Ya no necesitas el mapeo manual (Select) si usas AutoMapper
        var dtos = _mapper.Map<IEnumerable<AlojamientoResponseDto>>(alojamientos);

        return Ok(dtos);
    }
    // POST: api/Alojamientos
    [HttpPost]
    public async Task<ActionResult<Alojamiento>> Post([FromBody] Alojamiento alojamiento)
    {
        var nuevoAlojamiento = await _alojamientoRepository.AddAsync(alojamiento);

        return CreatedAtAction(nameof(Get), new { id = nuevoAlojamiento.AlojamientoID }, nuevoAlojamiento);
    }

    // PUT: api/Alojamientos/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Alojamiento alojamiento)
    {
        if (id != alojamiento.AlojamientoID)
        {
            return BadRequest(new { Message = "El ID de la ruta no coincide con el ID del cuerpo." });
        }

        // La implementación del repositorio maneja la lógica de actualización
        await _alojamientoRepository.UpdateAsync(alojamiento);
        return NoContent();
    }

    // DELETE: api/Alojamientos/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existente = await _alojamientoRepository.GetByIdAsync(id);
        if (existente == null)
        {
            return NotFound();
        }

        await _alojamientoRepository.DeleteAsync(id);
        return NoContent();
    }
}