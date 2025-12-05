using Microsoft.EntityFrameworkCore;
using ProyTour_Transporte_Hospedaje.Dtos;
using ProyTour_Transporte_Hospedaje.Dtos.VentaDto;
using ProyTour_Transporte_Hospedaje.Dtos.VentaDto.Detalle;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProyTour_Transporte_Hospedaje.Repositorios
{
    public class VentaRepository : IVentaRepository
    {
        private readonly ViajeTourContext _context;

        public VentaRepository(ViajeTourContext context)
        {
            _context = context;
        }

        // ================== CREATE ==================
        // Añade la cabecera de venta. Los detalles deben venir pre-cargados.
        public async Task CrearVentaAsync(Venta venta)
        {
            await _context.Venta.AddAsync(venta);
        }

        // ================== READ POR ID (Detalle de Venta) ==================
        // Carga la entidad Venta completa, incluyendo el usuario y los detalles (servicios/paquetes).
        public async Task<Venta?> ObtenerPorIdAsync(int idVenta)
        {
            return await _context.Venta
                .Include(v => v.IdUsuarioNavigation) // Carga el usuario
                .Include(v => v.VentaDetalles)
                    .ThenInclude(vd => vd.IdServicioNavigation) // Para el nombre del servicio unitario
                .Include(v => v.VentaDetalles)
                    .ThenInclude(vd => vd.IdPaqueteNavigation) // Para el nombre del paquete
                .FirstOrDefaultAsync(v => v.IdVenta == idVenta);
        }

        // ================== READ TODAS LAS VENTAS DEL USUARIO O TODAS (Proyección DTO) ==================
        public async Task<IEnumerable<VentaReadDto>> ObtenerTodasDtoAsync(int? idUsuario = null) // <-- Lógica para ver todo
        {
            // Lógica para filtrar: Si idUsuario tiene valor, filtramos por él.
            var consulta = _context.Venta.AsQueryable();

            if (idUsuario.HasValue)
            {
                consulta = consulta.Where(v => v.IdUsuario == idUsuario.Value);
            }

            // Eager Loading para los detalles y obtención de datos
            var ventas = await consulta
                .Include(v => v.IdUsuarioNavigation)
                .Include(v => v.VentaDetalles)
                    .ThenInclude(vd => vd.IdServicioNavigation)
                .Include(v => v.VentaDetalles)
                    .ThenInclude(vd => vd.IdPaqueteNavigation)
                .ToListAsync();

            // Mapeo Manual a DTO (Proyección en memoria)
            return ventas.Select(ventaDb => new VentaReadDto
            {
                IdVenta = ventaDb.IdVenta,
                FechaVenta = ventaDb.FechaVenta,
                Total = ventaDb.Total,
                IdUsuario = ventaDb.IdUsuario,
                NombreUsuario = ventaDb.IdUsuarioNavigation.Nombre + " " + ventaDb.IdUsuarioNavigation.Apellido,

                Detalles = ventaDb.VentaDetalles.Select(vd => new VentaDetalleReadDto
                {
                    IdVentaDetalle = vd.IdVentaDetalle,
                    TipoItem = vd.TipoItem,
                    Cantidad = vd.Cantidad,
                    PrecioUnitario = vd.PrecioUnitario,
                    Subtotal = (Decimal)vd.Subtotal!, // Subtotal se calcula en la DB o se asigna por EF Core

                    // Lógica para obtener el nombre del ítem
                    NombreItem = vd.TipoItem == VentaItemType.PAQUETE.ToString()
                                 ? vd.IdPaqueteNavigation?.Nombre ?? "Paquete Eliminado"
                                 : vd.IdServicioNavigation?.Nombre ?? "Servicio Eliminado"
                }).ToList()
            }).ToList();
        }

        // ================== DELETE ==================
        // Marca la entidad Venta para ser eliminada (VentaDetalles se eliminan en cascada).
        public void Eliminar(Venta venta)
        {
            _context.Venta.Remove(venta);
        }

        // ================== UTILIDAD: Obtener Precio ==================
        public async Task<decimal?> ObtenerPrecioItemAsync(int? idServicio, int? idPaquete)
        {
            if (idServicio.HasValue)
            {
                return await _context.Servicio
                    .Where(s => s.IdServicio == idServicio.Value)
                    .Select(s => s.PrecioBase)
                    .Cast<decimal?>()
                    .FirstOrDefaultAsync();
            }

            if (idPaquete.HasValue)
            {
                return await _context.Paquete
                    .Where(p => p.IdPaquete == idPaquete.Value)
                    .Select(p => p.PrecioTotal)
                    .Cast<decimal?>()
                    .FirstOrDefaultAsync();
            }

            return null;
        }

        // ================== SAVE ==================
        public async Task<bool> GuardarCambiosAsync()
        {
            return (await _context.SaveChangesAsync() >= 0);
        }
    }
}