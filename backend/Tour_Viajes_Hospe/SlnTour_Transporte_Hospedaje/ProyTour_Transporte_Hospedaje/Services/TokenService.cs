using Microsoft.IdentityModel.Tokens;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace ProyTour_Transporte_Hospedaje.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string CrearToken(Usuario usuario)
        {
            // 1. Definir los Claims (Datos que viajan en el token)
            var claims = new List<Claim>
        {
            // Sub/NameIdentifier es el identificador único del usuario
            new Claim(JwtRegisteredClaimNames.Sub, usuario.IdUsuario.ToString()),
            new Claim(ClaimTypes.NameIdentifier, usuario.IdUsuario.ToString()), // Para compatibilidad con GetCurrentUserId()
            new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
            new Claim(ClaimTypes.Name, usuario.Nombre + " " + usuario.Apellido)
        };

            // 2. Agregar los roles reales del usuario al token
            if (usuario.IdRols != null && usuario.IdRols.Any())
            {
                foreach (var rol in usuario.IdRols)
                {
                    claims.Add(new Claim(ClaimTypes.Role, rol.NombreRol.ToUpper()));
                }
            }
            else
            {
                // Si no tiene roles asignados, asignar CLIENTE por defecto
                claims.Add(new Claim(ClaimTypes.Role, "CLIENTE"));
            }

            // 3. Obtener la Clave y Parámetros
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // Obtener el tiempo de vida (DurationInMinutes)
            var durationMinutes = int.Parse(_config["JwtSettings:DurationInMinutes"] ?? "60");

            // ** CORRECCIÓN: USAR UTCNOW **
            var now = DateTime.UtcNow; // <--- Usamos UTC como referencia

            // 4. Crear la descripción del Token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                // AÑADIMOS NotBefore Y USAMOS UTCNOW
                NotBefore = now,
                // CALCULAMOS Expires USANDO UTCNOW
                Expires = now.AddMinutes(durationMinutes),

                SigningCredentials = creds,
                Issuer = _config["JwtSettings:Issuer"],
                Audience = _config["JwtSettings:Audience"]
            };

            // 5. Generar el Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
