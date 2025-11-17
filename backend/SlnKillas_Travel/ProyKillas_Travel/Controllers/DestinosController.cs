using Microsoft.AspNetCore.Mvc;
using KillasTravel.Application.Interfaces;
using KillasTravel.Domain.Entities;
using System.Threading.Tasks;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")] // La ruta será /api/Destinos
public class DestinosController : ControllerBase
{
    private readonly IDestinoRepository _destinoRepository;

    // 1. Inyección de Dependencias del Repositorio
    public DestinosController(IDestinoRepository destinoRepository)
    {
        // El DI (Program.cs) provee la implementación concreta del Repositorio
        _destinoRepository = destinoRepository;
    }

    // GET: api/Destinos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Destino>>> Get()
    {
        var destinos = await _destinoRepository.GetAllAsync();
        return Ok(destinos); // Devuelve la lista de destinos con código 200 OK
    }

    // GET api/Destinos/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Destino>> Get(int id)
    {
        var destino = await _destinoRepository.GetByIdAsync(id);

        if (destino == null)
        {
            return NotFound(); // Devuelve código 404 si no existe
        }

        return Ok(destino);
    }

    // POST: api/Destinos
    [HttpPost]
    public async Task<ActionResult<Destino>> Post([FromBody] Destino destino)
    {
        var nuevoDestino = await _destinoRepository.AddAsync(destino);

        // Devuelve código 201 Created y la ubicación del nuevo recurso
        return CreatedAtAction(nameof(Get), new { id = nuevoDestino.DestinoID }, nuevoDestino);
    }

    // PUT: api/Destinos/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Destino destino)
    {
        if (id != destino.DestinoID)
        {
            return BadRequest(new { Message = "El ID de la ruta no coincide con el ID del cuerpo." });
        }

        var existente = await _destinoRepository.GetByIdAsync(id);
        if (existente == null)
        {
            return NotFound();
        }

        await _destinoRepository.UpdateAsync(destino);
        return NoContent(); // Devuelve código 204 No Content (Éxito sin devolver datos)
    }

    // DELETE: api/Destinos/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existente = await _destinoRepository.GetByIdAsync(id);
        if (existente == null)
        {
            return NotFound();
        }

        await _destinoRepository.DeleteAsync(id);
        return NoContent();
    }
}