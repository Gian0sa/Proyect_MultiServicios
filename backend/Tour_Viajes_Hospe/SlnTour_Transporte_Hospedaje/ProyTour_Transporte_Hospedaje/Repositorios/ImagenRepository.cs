using Microsoft.EntityFrameworkCore;
using ProyTour_Transporte_Hospedaje.Dtos.ImagenDto;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Repositorios
{
    public class ImagenRepository : IImagenRepository
    {
        private readonly ViajeTourContext _context;

        public ImagenRepository(ViajeTourContext context)
        {
            _context = context;
        }

        // Obtener todas las imágenes de una entidad específica (Hospedaje, Tour, Transporte, Paquete)
        public async Task<IEnumerable<ImagenReadDto>> ObtenerPorEntidadAsync(string tipoEntidad, int idEntidad)
        {
            return await _context.Imagen
                .Where(i => i.TipoEntidad.ToUpper() == tipoEntidad.ToUpper() && i.IdEntidad == idEntidad)
                .Select(i => new ImagenReadDto
                {
                    IdImagen = i.IdImagen,
                    TipoEntidad = i.TipoEntidad,
                    IdEntidad = i.IdEntidad,
                    Url = i.Url,
                    Descripcion = i.Descripcion
                })
                .ToListAsync();
        }

        // Obtener imágenes de múltiples servicios (para paquetes)
        // Este método obtiene las imágenes de todos los servicios que componen un paquete
        public async Task<IEnumerable<ImagenReadDto>> ObtenerPorServiciosAsync(List<int> idServicios)
        {
            if (idServicios == null || !idServicios.Any())
            {
                return new List<ImagenReadDto>();
            }

            // Obtener IDs de hospedajes
            var idHospedajes = await _context.Hospedaje
                .Where(h => idServicios.Contains(h.IdServicio))
                .Select(h => h.IdHospedaje)
                .ToListAsync();

            // Obtener IDs de tours
            var idTours = await _context.Tour
                .Where(t => idServicios.Contains(t.IdServicio))
                .Select(t => t.IdTour)
                .ToListAsync();

            // Obtener IDs de transportes
            var idTransportes = await _context.Transporte
                .Where(tr => idServicios.Contains(tr.IdServicio))
                .Select(tr => tr.IdTransporte)
                .ToListAsync();

            // Obtener todas las imágenes de estos servicios
            var imagenes = await _context.Imagen
                .Where(i =>
                    (i.TipoEntidad == "HOSPEDAJE" && idHospedajes.Contains(i.IdEntidad)) ||
                    (i.TipoEntidad == "TOUR" && idTours.Contains(i.IdEntidad)) ||
                    (i.TipoEntidad == "TRANSPORTE" && idTransportes.Contains(i.IdEntidad))
                )
                .Select(i => new ImagenReadDto
                {
                    IdImagen = i.IdImagen,
                    TipoEntidad = i.TipoEntidad,
                    IdEntidad = i.IdEntidad,
                    Url = i.Url,
                    Descripcion = i.Descripcion
                })
                .ToListAsync();

            return imagenes;
        }

        // Obtener imagen por ID
        public async Task<Imagen?> ObtenerPorIdAsync(int idImagen)
        {
            return await _context.Imagen.FindAsync(idImagen);
        }

        // Crear nueva imagen
        public async Task CrearAsync(Imagen imagen)
        {
            await _context.Imagen.AddAsync(imagen);
        }

        // Actualizar imagen
        public void Actualizar(Imagen imagen)
        {
            _context.Imagen.Update(imagen);
        }

        // Eliminar imagen
        public void Eliminar(Imagen imagen)
        {
            _context.Imagen.Remove(imagen);
        }

        // Guardar cambios
        public async Task<bool> GuardarCambiosAsync()
        {
            return await _context.SaveChangesAsync() >= 0;
        }
    }
}

