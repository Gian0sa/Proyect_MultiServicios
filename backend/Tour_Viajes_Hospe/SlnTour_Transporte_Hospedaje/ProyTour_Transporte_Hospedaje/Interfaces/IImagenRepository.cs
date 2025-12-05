using ProyTour_Transporte_Hospedaje.Dtos.ImagenDto;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Interfaces
{
    public interface IImagenRepository
    {
        // Obtener todas las imágenes de una entidad específica
        Task<IEnumerable<ImagenReadDto>> ObtenerPorEntidadAsync(string tipoEntidad, int idEntidad);

        // Obtener todas las imágenes de múltiples servicios (para paquetes)
        Task<IEnumerable<ImagenReadDto>> ObtenerPorServiciosAsync(List<int> idServicios);

        // Obtener imagen por ID
        Task<Imagen?> ObtenerPorIdAsync(int idImagen);

        // Crear nueva imagen
        Task CrearAsync(Imagen imagen);

        // Actualizar imagen
        void Actualizar(Imagen imagen);

        // Eliminar imagen
        void Eliminar(Imagen imagen);

        // Guardar cambios
        Task<bool> GuardarCambiosAsync();
    }
}

