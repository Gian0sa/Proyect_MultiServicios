using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Controllers
{
    [Route("api/[controller]")] // Ruta: /api/Departamento
    [ApiController]
    public class DepartamentoController : ControllerBase
    {
        private readonly IDepartamentoRepository _repositorio;

        public DepartamentoController(IDepartamentoRepository repositorio)
        {
            _repositorio = repositorio;
        }

        // GET: api/Departamento
        // Este endpoint es público y no requiere autenticación.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Departamento>>> GetDepartamentos()
        {
            var departamentos = await _repositorio.ObtenerTodosAsync();

            // Comprobación de que la lista no esté vacía
            if (departamentos == null || !departamentos.Any())
            {
                return NotFound("No se encontraron departamentos en la base de datos.");
            }

            return Ok(departamentos); // Código 200 con la lista
        }
    }
}
