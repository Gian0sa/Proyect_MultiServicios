using ProyTour_Transporte_Hospedaje.Dtos.VentaDto;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Interfaces
{
    public interface IVentaRepository
    {
        Task<IEnumerable<VentaReadDto>> ObtenerTodasDtoAsync(int? idUsuario = null);

        // Obtiene la entidad completa de Venta (utilizado en GET /api/Venta/{id} y DELETE)
        Task<Venta?> ObtenerPorIdAsync(int idVenta);

        // ================== CREATE / DELETE ==================
        // Para registrar la cabecera y los detalles de la venta
        Task CrearVentaAsync(Venta venta);

        // Para anular o eliminar la venta
        void Eliminar(Venta venta);

        // ================== UTILIDAD ==================
        // Obtiene el precio base de un ítem (Servicio o Paquete) para el cálculo del total
        Task<decimal?> ObtenerPrecioItemAsync(int? idServicio, int? idPaquete);

        // ================== SAVE ==================
        // Persiste los cambios
        Task<bool> GuardarCambiosAsync();
    }
}
