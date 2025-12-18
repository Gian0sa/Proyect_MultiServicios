using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProyTour_Transporte_Hospedaje.Dtos;
using ProyTour_Transporte_Hospedaje.Dtos.VentaDto;
using ProyTour_Transporte_Hospedaje.Dtos.VentaDto.Detalle;
using ProyTour_Transporte_Hospedaje.Interfaces;
using ProyTour_Transporte_Hospedaje.Models;
using ProyTour_Transporte_Hospedaje.Services;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace ProyTour_Transporte_Hospedaje.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VentaController : ControllerBase
    {
        private readonly IVentaRepository _repositorio;
        private readonly IEmailService _emailService;

        public VentaController(
            IVentaRepository repositorio,
            IEmailService emailService
        )
        {
            _repositorio = repositorio;
            _emailService = emailService;
        }

        // ==========================================================
        // UTILIDAD: Obtener ID del Usuario desde el Token
        // ==========================================================
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
        // POST: /api/Venta (Crear Nueva Venta)
        // ==========================================================
        [HttpPost]
        public async Task<ActionResult<VentaReadDto>> PostVenta([FromBody] VentaCreateDto ventaDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            int? idUsuario = GetCurrentUserId();
            if (idUsuario == null)
                return Unauthorized(new { message = "Usuario no identificado." });

            decimal totalVenta = 0;
            var ventaDetalles = new List<VentaDetalle>();

            // Procesar detalles
            foreach (var detalleDto in ventaDto.Detalles)
            {
                bool isService = detalleDto.TipoItem == VentaItemType.SERVICIO;
                bool isPaquete = detalleDto.TipoItem == VentaItemType.PAQUETE;

                if ((isService && !detalleDto.IdServicio.HasValue) ||
                    (isPaquete && !detalleDto.IdPaquete.HasValue) ||
                    (!isService && !isPaquete))
                {
                    return BadRequest(new
                    {
                        message = $"El tipo de ítem {detalleDto.TipoItem} requiere una ID válida."
                    });
                }

                decimal? precioUnitario =
                    await _repositorio.ObtenerPrecioItemAsync(
                        detalleDto.IdServicio,
                        detalleDto.IdPaquete
                    );

                if (precioUnitario == null || precioUnitario <= 0)
                {
                    return BadRequest(new
                    {
                        message = "El ítem no existe o tiene precio inválido."
                    });
                }

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

            // Crear venta
            var ventaModel = new Venta
            {
                IdUsuario = idUsuario.Value,
                FechaVenta = DateTime.UtcNow,
                Total = totalVenta,
                VentaDetalles = ventaDetalles
            };

            await _repositorio.CrearVentaAsync(ventaModel);

            if (await _repositorio.GuardarCambiosAsync())
            {
                // 🔔 ENVIAR CORREO AL ADMIN
                try
                {
                    await _emailService.EnviarCorreoNuevaVentaAsync(
                        ventaModel.IdVenta,
                        ventaModel.Total
                    );
                }
                catch
                {
                    // No romper la venta si el correo falla
                }

                return CreatedAtAction(
                    nameof(GetVenta),
                    new { id = ventaModel.IdVenta },
                    new { idVenta = ventaModel.IdVenta, total = ventaModel.Total }
                );
            }

            return StatusCode(500, "Error al procesar la venta.");
        }

        // ==========================================================
        // GET: /api/Venta/{id}
        // ==========================================================
        [HttpGet("{id}")]
        public async Task<ActionResult<VentaReadDto>> GetVenta(int id)
        {
            var ventaDb = await _repositorio.ObtenerPorIdAsync(id);

            if (ventaDb == null)
                return NotFound($"Venta con ID {id} no encontrada.");

            int? idUsuario = GetCurrentUserId();

            if (ventaDb.IdUsuario != idUsuario &&
                !User.IsInRole("ADMIN") &&
                !User.IsInRole("EMPLEADO"))
            {
                return Forbid();
            }

            var ventaReadDto = new VentaReadDto
            {
                IdVenta = ventaDb.IdVenta,
                FechaVenta = ventaDb.FechaVenta,
                Total = ventaDb.Total,
                IdUsuario = ventaDb.IdUsuario,
                NombreUsuario =
                    ventaDb.IdUsuarioNavigation.Nombre + " " +
                    ventaDb.IdUsuarioNavigation.Apellido,

                Detalles = ventaDb.VentaDetalles.Select(vd => new VentaDetalleReadDto
                {
                    IdVentaDetalle = vd.IdVentaDetalle,
                    TipoItem = vd.TipoItem,
                    Cantidad = vd.Cantidad,
                    PrecioUnitario = vd.PrecioUnitario,
                    Subtotal = (decimal)vd.Subtotal!,
                    NombreItem =
                        vd.TipoItem == VentaItemType.PAQUETE.ToString()
                        ? vd.IdPaqueteNavigation?.Nombre ?? "Paquete Eliminado"
                        : vd.IdServicioNavigation?.Nombre ?? "Servicio Eliminado"
                }).ToList()
            };

            return Ok(ventaReadDto);
        }

        // ==========================================================
        // GET: /api/Venta
        // ==========================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VentaReadDto>>> GetHistorialVentas()
        {
            int? idUsuario = GetCurrentUserId();
            int? filtroUsuarioId = null;

            if (!User.IsInRole("ADMIN") && !User.IsInRole("EMPLEADO"))
            {
                if (idUsuario == null)
                    return Unauthorized(new { message = "Usuario no identificado." });

                filtroUsuarioId = idUsuario.Value;
            }

            var ventasDto = await _repositorio.ObtenerTodasDtoAsync(filtroUsuarioId);

            if (!ventasDto.Any())
                return NotFound("No se encontraron ventas.");

            return Ok(ventasDto);
        }

        // ==========================================================
        // DELETE: /api/Venta/{id}
        // ==========================================================
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteVenta(int id)
        {
            var ventaExistente = await _repositorio.ObtenerPorIdAsync(id);
            if (ventaExistente == null)
                return NotFound($"Venta con ID {id} no encontrada.");

            _repositorio.Eliminar(ventaExistente);

            if (await _repositorio.GuardarCambiosAsync())
                return NoContent();

            return StatusCode(500, "Error al anular la venta.");
        }
    }
}
