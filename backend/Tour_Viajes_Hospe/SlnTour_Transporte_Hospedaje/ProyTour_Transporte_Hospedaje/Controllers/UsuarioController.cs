using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProyTour_Transporte_Hospedaje.Dtos.Logeo;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Controllers
{
    [Route("api/[controller]")] // Define la ruta base: /api/Usuario
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IPasswordHasher<object> _passwordHasher;
        private readonly ITokenService _tokenService;

        // Constructor con Inyección de Dependencias (DI)
        public UsuarioController(IUsuarioRepository usuarioRepository, IPasswordHasher<object> passwordHasher, ITokenService tokenService)
        {
            _usuarioRepository = usuarioRepository;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
        }

        // POST: api/Usuario/registrar
        // Este endpoint recibe los datos del formulario de registro de React.
        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] UsuarioCreateDto usuarioDto)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _usuarioRepository.EmailExisteAsync(usuarioDto.Email))
            {
                return Conflict(new { message = "El email ya está registrado y no puede ser usado." }); 
            }


            var nuevoUsuario = new Usuario
            {
                Dni = usuarioDto.Dni,
                Nombre = usuarioDto.Nombre,
                Apellido = usuarioDto.Apellido,
                Email = usuarioDto.Email,

                PasswordHash = _passwordHasher.HashPassword(usuarioDto, usuarioDto.Password),
                Telefono = null 
            };


            var usuarioCreado = await _usuarioRepository.RegistrarAsync(nuevoUsuario);

            return CreatedAtAction(nameof(Registrar),
                                   new { email = usuarioCreado.Email },
                                   new { id = usuarioCreado.IdUsuario, email = usuarioCreado.Email, nombre = usuarioCreado.Nombre });
        }

        // POST: api/Usuario/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // 1. Validación de DTO
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // 2. Obtener el Usuario por Email
            var usuario = await _usuarioRepository.ObtenerPorEmailAsync(loginDto.Email);

            // 3. Verificar si el usuario existe
            if (usuario == null)
            {
                // Evitamos dar detalles específicos de si el email existe o no por seguridad
                return Unauthorized(new { message = "Credenciales inválidas." }); // Código 401
            }

            // 4. VERIFICAR LA CONTRASEÑA HASHEADA
            // Usamos el PasswordHasher inyectado
            var resultadoHash = _passwordHasher.VerifyHashedPassword(usuario, usuario.PasswordHash, loginDto.Password);

            // 5. Comprobar el resultado de la verificación
            if (resultadoHash == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Credenciales inválidas." }); // Código 401
            }

            // 6. CREAR Y DEVOLVER EL TOKEN (¡Éxito!)
            var token = _tokenService.CrearToken(usuario);
            var rol = usuario.IdRols?.FirstOrDefault()?.NombreRol?.ToUpper() ?? "CLIENTE";
            // Devolvemos el token JWT al cliente
            return Ok(new
            {
                Token = token,
                UsuarioId = usuario.IdUsuario,
                Nombre = usuario.Nombre,
                Email = usuario.Email,
                Role=rol
            });
        }

    }
}
