using Microsoft.AspNetCore.Mvc;

namespace Proy_Backend.Controllers
{
    // Define que es un controlador de API y habilita características específicas de API
    [ApiController]
    // Define la ruta base para este controlador
    [Route("api/[controller]")]
    public class TestController : ControllerBase // Hereda de ControllerBase, no de Controller
    {
        private readonly ILogger<TestController> _logger;

        public TestController(ILogger<TestController> logger)
        {
            _logger = logger;
        }

        // Define un método de respuesta HTTP GET
        [HttpGet("test")]
        public ActionResult<string> TestConnection()
        {
            _logger.LogInformation("Endpoint de prueba alcanzado.");
            // Devuelve el mensaje de prueba como texto (string)
            return Ok("¡Conexión exitosa desde el Backend!");
        }
    }
}