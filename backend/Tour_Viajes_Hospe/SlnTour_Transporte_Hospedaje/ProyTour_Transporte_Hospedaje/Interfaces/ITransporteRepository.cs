using ProyTour_Transporte_Hospedaje.Dtos.TransporteDto;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Interfaces
{
    public interface ITransporteRepository
    {
        // READ
        Task<IEnumerable<TransporteReadDto>> ObtenerTodosDtoAsync();
        Task<Transporte?> ObtenerPorIdAsync(int idTransporte);

        // CREATE
        Task CrearTransporteAsync(Servicio servicio, Transporte transporte);

        // UPDATE
        void Actualizar(Servicio servicio, Transporte transporte);

        // DELETE
        void Eliminar(Servicio servicio, Transporte transporte);

        // SAVE
        Task<bool> GuardarCambiosAsync();
    }
}
