using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProyTour_Transporte_Hospedaje.Dtos;
using ProyTour_Transporte_Hospedaje.Dtos.VentaDto;
using ProyTour_Transporte_Hospedaje.Dtos.VentaDto.Detalle;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace ProyTour_Transporte_Hospedaje.Controllers
{
    [Route("api/[controller]")] // Ruta: /api/Venta
    [ApiController]
    [Authorize] // Todas las ventas requieren que el usuario esté logeado
    public class VentaController : ControllerBase
    {
        private readonly IVentaRepository _repositorio;

        public VentaController(IVentaRepository repositorio)
        {
            _repositorio = repositorio;
        }

        // --- UTILIDAD: Obtener ID del Usuario del Token
        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim != null && int.TryParse(userIdClaim, out int idUsuario))
            {
                return idUsuario;
            }
            return null;
        }

        // ==========================================================
        // POST: /api/Venta (Crear Nueva Venta - PROTEGIDO)
        // ==========================================================
        [HttpPost]
        public async Task<ActionResult<VentaReadDto>> PostVenta([FromBody] VentaCreateDto ventaDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            int? idUsuario = GetCurrentUserId();
            if (idUsuario == null) return Unauthorized(new { message = "Usuario no identificado." });

            decimal totalVenta = 0;
            var ventaDetalles = new List<VentaDetalle>();

            // 2. PROCESAR DETALLES Y CALCULAR TOTAL
            foreach (var detalleDto in ventaDto.Detalles)
            {
                bool isService = detalleDto.TipoItem == VentaItemType.SERVICIO;
                bool isPaquete = detalleDto.TipoItem == VentaItemType.PAQUETE;

                // Validación de IDs: Solo debe haber una ID presente
                if ((isService && !detalleDto.IdServicio.HasValue) || (isPaquete && !detalleDto.IdPaquete.HasValue) ||
                    (!isService && !isPaquete))
                {
                    return BadRequest(new { message = $"El tipo de ítem {detalleDto.TipoItem} requiere una ID válida." });
                }

                // Obtener el precio base
                decimal? precioUnitario = await _repositorio.ObtenerPrecioItemAsync(detalleDto.IdServicio, detalleDto.IdPaquete);

                if (precioUnitario == null || precioUnitario.Value <= 0)
                {
                    return BadRequest(new { message = $"El ítem no existe o tiene precio cero." });
                }

                // Crear la entidad VentaDetalle
                var detalleModel = new VentaDetalle
                {
                    TipoItem = detalleDto.TipoItem.ToString(),
                    IdServicio = detalleDto.IdServicio,
                    IdPaquete = detalleDto.IdPaquete,
                    Cantidad = detalleDto.Cantidad,
                    PrecioUnitario = precioUnitario.Value
                };

                ventaDetalles.Add(detalleModel);
                totalVenta += detalleModel.Cantidad * detalleModel.PrecioUnitario;
            }

            // 3. CREAR CABECERA DE VENTA
            var ventaModel = new Venta // Usamos Venta
            {
                IdUsuario = idUsuario.Value,
                FechaVenta = DateTime.UtcNow,
                Total = totalVenta,
                VentaDetalles = ventaDetalles
            };

            await _repositorio.CrearVentaAsync(ventaModel);

            if (await _repositorio.GuardarCambiosAsync())
            {
                // Devolvemos el DTO de respuesta simplificado
                return CreatedAtAction(nameof(GetVenta),
                    new { id = ventaModel.IdVenta }, new { idVenta = ventaModel.IdVenta, total = ventaModel.Total });
            }
            return StatusCode(500, "Error al procesar la venta.");
        }

        // ==========================================================
        // GET: /api/Venta/{id} (Obtener detalles de una venta específica)
        // ==========================================================
        [HttpGet("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<VentaReadDto>> GetVenta(int id)
        {
            var ventaDb = await _repositorio.ObtenerPorIdAsync(id);

            if (ventaDb == null)
            {
                return NotFound($"Venta con ID {id} no encontrada.");
            }

            int? idUsuario = GetCurrentUserId();
            // Restricción de seguridad: Solo el dueño o ADMIN/EMPLEADO pueden verla
            if (ventaDb.IdUsuario != idUsuario && !User.IsInRole("ADMIN") && !User.IsInRole("EMPLEADO"))
            {
                return Forbid(); // Código 403
            }

            // Mapeo manual de Venta (Modelo DB) a VentaReadDto
            var ventaReadDto = new VentaReadDto
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
                    Subtotal = (Decimal)vd.Subtotal!,

                    NombreItem = vd.TipoItem == VentaItemType.PAQUETE.ToString()
                                 ? vd.IdPaqueteNavigation?.Nombre ?? "Paquete Eliminado"
                                 : vd.IdServicioNavigation?.Nombre ?? "Servicio Eliminado"
                }).ToList()
            };

            return Ok(ventaReadDto);
        }

        // ==========================================================
        // GET: /api/Venta (Listar historial de ventas del usuario actual o todas)
        // ==========================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VentaReadDto>>> GetHistorialVentas()
        {
            int? idUsuario = GetCurrentUserId();

            // Lógica para determinar el alcance
            int? filtroUsuarioId = null;

            // Si NO es Administrador ni Empleado, solo puede ver su propio historial
            if (!User.IsInRole("ADMIN") && !User.IsInRole("EMPLEADO"))
            {
                if (idUsuario == null) return Unauthorized(new { message = "Usuario no identificado." });
                filtroUsuarioId = idUsuario.Value;
            }
            // Si es ADMIN/EMPLEADO, el filtroUsuarioId será null (ver todo, según lógica de Repositorio)

            // Obtenemos las ventas filtradas
            var ventasDto = await _repositorio.ObtenerTodasDtoAsync(filtroUsuarioId);

            if (!ventasDto.Any())
            {
                string mensaje = filtroUsuarioId.HasValue
                    ? "No se encontró historial de ventas para este usuario."
                    : "No se encontraron ventas en el sistema.";

                return NotFound(mensaje);
            }

            return Ok(ventasDto);
        }

        // ==========================================================
        // DELETE: /api/Venta/{id} (Anular Venta)
        // Solo ADMIN puede anular ventas
        // ==========================================================
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteVenta(int id)
        {
            var ventaExistente = await _repositorio.ObtenerPorIdAsync(id);
            if (ventaExistente == null)
            {
                return NotFound($"Venta con ID {id} no encontrada.");
            }

            _repositorio.Eliminar(ventaExistente);

            if (await _repositorio.GuardarCambiosAsync())
            {
                return NoContent(); // 204 No Content
            }

            return StatusCode(500, "Error al anular la venta.");
        }
    }
}