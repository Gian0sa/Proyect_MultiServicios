using Microsoft.AspNetCore.Mvc;
using KillasTravel.Application.Interfaces;
using KillasTravel.Domain.Entities;

[ApiController]
[Route("api/[controller]")] // La ruta será /api/Tours
public class ToursController : ControllerBase
{
    private readonly ITourRepository _tourRepository;

    public ToursController(ITourRepository tourRepository)
    {
        _tourRepository = tourRepository;
    }

    // GET: api/Tours (Trae todos los tours con su Destino)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tour>>> Get()
    {
        var tours = await _tourRepository.GetAllAsync();
        return Ok(tours);
    }

    // GET api/Tours/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Tour>> Get(int id)
    {
        var tour = await _tourRepository.GetByIdAsync(id);
        return tour == null ? NotFound() : Ok(tour);
    }
    [HttpGet("ByRegion/{regionId}")]
    public async Task<ActionResult<IEnumerable<Tour>>> GetByRegion(int regionId)
    {
        var tours = await _tourRepository.GetByRegionIdAsync(regionId);

        if (!tours.Any())
        {
            return NotFound($"No se encontraron tours para la región ID {regionId}.");
        }

        return Ok(tours);
    }
    [HttpGet("ByPriceRange")]
    public async Task<ActionResult<IEnumerable<Tour>>> GetByPriceRange(
    [FromQuery] decimal minPrice,
    [FromQuery] decimal maxPrice)
    {
        var tours = await _tourRepository.GetByPriceRangeAsync(minPrice, maxPrice);

        if (!tours.Any())
        {
            return NotFound($"No se encontraron tours en el rango de S/{minPrice} a S/{maxPrice}.");
        }

        return Ok(tours);
    }

    // POST: api/Tours
    [HttpPost]
    public async Task<ActionResult<Tour>> Post([FromBody] Tour tour)
    {
        var nuevoTour = await _tourRepository.AddAsync(tour);
        return CreatedAtAction(nameof(Get), new { id = nuevoTour.TourID }, nuevoTour);
    }

    // PUT: api/Tours/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Tour tour)
    {
        if (id != tour.TourID)
        {
            return BadRequest(new { Message = "El ID de la ruta no coincide con el ID del cuerpo." });
        }
        await _tourRepository.UpdateAsync(tour);
        return NoContent();
    }

    // DELETE: api/Tours/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _tourRepository.DeleteAsync(id);
        return NoContent();
    }

}