using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Interfaces
{
    public interface IDestinoRepository
    {
        // READ
        Task<IEnumerable<Destino>> ObtenerTodosAsync();
        Task<Destino?> ObtenerPorIdAsync(int id);

        // CREATE
        Task<Destino> CrearAsync(Destino destino);

        // UPDATE
        void Actualizar(Destino destino);

        // DELETE
        void Eliminar(Destino destino);

        // GUARDAR CAMBIOS (Necesario para que la actualización y eliminación se persistan)
        Task<bool> GuardarCambiosAsync();
    }
}
