using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Interfaces
{
    public interface IUsuarioRepository
    {
        // Verifica si un usuario con el mismo email ya existe.
        Task<bool> EmailExisteAsync(string email);

        // Registra un nuevo usuario en la base de datos.
        Task<Usuario> RegistrarAsync(Usuario nuevoUsuario);

        // Para el login: buscar usuario por email.
        Task<Usuario> ObtenerPorEmailAsync(string email);
    }
}
