using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Interfaces
{
    public interface ITokenService
    {
        // Genera el token JWT basándose en la información del usuario
        string CrearToken(Usuario usuario);
    }
}
