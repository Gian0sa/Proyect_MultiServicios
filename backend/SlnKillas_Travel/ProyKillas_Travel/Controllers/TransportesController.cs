using Microsoft.AspNetCore.Mvc;
using KillasTravel.Application.Interfaces;
using KillasTravel.Domain.Entities;

[ApiController]
[Route("api/[controller]")] // La ruta será /api/Transportes
public class TransportesController : ControllerBase
{
    private readonly ITransporteRepository _transporteRepository;

    public TransportesController(ITransporteRepository transporteRepository)
    {
        _transporteRepository = transporteRepository;
    }

    // GET: api/Transportes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transporte>>> Get()
    {
        var transportes = await _transporteRepository.GetAllAsync();
        return Ok(transportes);
    }

    // GET api/Transportes/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Transporte>> Get(int id)
    {
        var transporte = await _transporteRepository.GetByIdAsync(id);
        return transporte == null ? NotFound() : Ok(transporte);
    }

    [HttpGet("ByRegion/{regionId}")]
    public async Task<ActionResult<IEnumerable<Transporte>>> GetByRegion(int regionId)
    {
        var transportes = await _transporteRepository.GetByRegionIdAsync(regionId);

        if (!transportes.Any())
        {
            return NotFound($"No se encontraron rutas de transporte para la región ID {regionId}.");
        }

        return Ok(transportes);
    }
    [HttpGet("ByPriceRange")]
    public async Task<ActionResult<IEnumerable<Transporte>>> GetByPriceRange(
    [FromQuery] decimal minPrice,
    [FromQuery] decimal maxPrice)
    {
        var transportes = await _transporteRepository.GetByPriceRangeAsync(minPrice, maxPrice);

        if (!transportes.Any())
        {
            return NotFound($"No se encontraron rutas de transporte con tarifas en el rango de S/{minPrice} a S/{maxPrice}.");
        }

        return Ok(transportes);
    }
    // POST: api/Transportes
    [HttpPost]
    public async Task<ActionResult<Transporte>> Post([FromBody] Transporte transporte)
    {
        var nuevoTransporte = await _transporteRepository.AddAsync(transporte);
        return CreatedAtAction(nameof(Get), new { id = nuevoTransporte.TransporteID }, nuevoTransporte);
    }

    // PUT: api/Transportes/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Transporte transporte)
    {
        if (id != transporte.TransporteID)
        {
            return BadRequest(new { Message = "El ID de la ruta no coincide con el ID del cuerpo." });
        }
        await _transporteRepository.UpdateAsync(transporte);
        return NoContent();
    }

    // DELETE: api/Transportes/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _transporteRepository.DeleteAsync(id);
        return NoContent();
    }
}