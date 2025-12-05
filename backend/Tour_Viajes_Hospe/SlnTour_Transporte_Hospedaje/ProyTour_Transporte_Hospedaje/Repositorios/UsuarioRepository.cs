using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Repositorios
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly ViajeTourContext _context;
        // Inyectamos el PasswordHasher. Usamos 'object' porque el PasswordHasher no necesita el tipo de usuario real para el hasheo.
        private readonly IPasswordHasher<object> _passwordHasher;

        public UsuarioRepository(ViajeTourContext context, IPasswordHasher<object> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<bool> EmailExisteAsync(string email)
        {
            return await _context.Usuario.AnyAsync(u => u.Email == email);
        }

        public async Task<Usuario> RegistrarAsync(Usuario nuevoUsuario)
        {
            // 1. **HASHEAR LA CONTRASEÑA** antes de guardar.
            // nuevoUsuario.PasswordHash DEBE ser llenado por el controlador antes de llegar aquí.

            // Asignamos el rol por defecto (CLIENTE)
            // En tu DB, tienes un TRIGGER para esto. Si no lo usas, debes hacerlo aquí:
            // var rolCliente = await _context.Rol.FirstOrDefaultAsync(r => r.NombreRol == "CLIENTE");
            // if (rolCliente != null) { /* Asignar rol */ }

            _context.Usuario.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            return nuevoUsuario;
        }

        public async Task<Usuario> ObtenerPorEmailAsync(string email)
        {
            return await _context.Usuario
                .Include(u => u.IdRols) // Cargar los roles del usuario
                .FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
