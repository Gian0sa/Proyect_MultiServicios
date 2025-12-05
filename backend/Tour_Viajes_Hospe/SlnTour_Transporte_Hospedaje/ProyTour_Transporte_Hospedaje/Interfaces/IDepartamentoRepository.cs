using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Interfaces
{
    public interface IDepartamentoRepository
    {
        
        Task<IEnumerable<Departamento>> ObtenerTodosAsync();
    }
}
