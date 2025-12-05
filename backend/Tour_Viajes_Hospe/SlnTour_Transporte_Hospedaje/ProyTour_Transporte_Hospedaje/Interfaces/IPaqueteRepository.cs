using ProyTour_Transporte_Hospedaje.Dtos.PaqueteDto;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Interfaces
{
    public interface IPaqueteRepository
    {
        // ================== READ ==================
        // Para el listado general (simple)
        Task<IEnumerable<PaqueteReadDto>> ObtenerTodosDtoAsync();

        // Para el detalle (Necesario para GET/{id}, POST y PUT, incluye PaqueteDetalles y Servicio)
        Task<Paquete?> ObtenerPorIdAsync(int idPaquete);

        // ================== CREATE / UPDATE / DELETE ==================
        Task CrearPaqueteAsync(Paquete paquete);
        void Actualizar(Paquete paquete);
        void Eliminar(Paquete paquete);

        // ================== UTILIDAD ==================
        // Para validar que el servicio existe antes de crear un Paquete_Detalle
        Task<bool> ExisteServicioAsync(int idServicio);

        // ================== SAVE ==================
        Task<bool> GuardarCambiosAsync();
    }
}
