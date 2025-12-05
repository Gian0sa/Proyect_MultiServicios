using ProyTour_Transporte_Hospedaje.Dtos.TourDto;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Interfaces
{
    public interface ITourRepository
    {
        // READ
        Task<IEnumerable<TourReadDto>> ObtenerTodosDtoAsync();
        Task<Tour?> ObtenerPorIdAsync(int idTour);

        // CREATE
        Task CrearTourAsync(Servicio servicio, Tour tour);

        // UPDATE
        void Actualizar(Servicio servicio, Tour tour);

        // DELETE
        void Eliminar(Servicio servicio, Tour tour);

        // SAVE
        Task<bool> GuardarCambiosAsync();
    }
}
