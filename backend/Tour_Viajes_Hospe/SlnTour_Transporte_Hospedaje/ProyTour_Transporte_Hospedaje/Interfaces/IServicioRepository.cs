using ProyTour_Transporte_Hospedaje.Dtos;

namespace ProyTour_Transporte_Hospedaje.Interfaces
{
    public interface IServicioRepository
    {
        // Obtiene todos los servicios (sin los detalles específicos de Tour/Hospedaje)
        Task<IEnumerable<ServicioReadDto>> ObtenerTodosDtoAsync();

        // Obtiene servicios filtrados por tipo (ej. "HOSPEDAJE")
        Task<IEnumerable<ServicioReadDto>> ObtenerPorTipoDtoAsync(string tipo);
    }
}
