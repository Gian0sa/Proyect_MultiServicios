using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KillasTravel.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FinalSchemaSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Paquetes",
                columns: table => new
                {
                    PaqueteID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DuracionDias = table.Column<int>(type: "int", nullable: true),
                    PrecioTotal = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Paquetes", x => x.PaqueteID);
                });

            migrationBuilder.CreateTable(
                name: "Regiones",
                columns: table => new
                {
                    RegionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Regiones", x => x.RegionID);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    UsuarioID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Apellido = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rol = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.UsuarioID);
                });

            migrationBuilder.CreateTable(
                name: "Destinos",
                columns: table => new
                {
                    DestinoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RegionID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Destinos", x => x.DestinoID);
                    table.ForeignKey(
                        name: "FK_Destinos_Regiones_RegionID",
                        column: x => x.RegionID,
                        principalTable: "Regiones",
                        principalColumn: "RegionID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Ordenes",
                columns: table => new
                {
                    OrdenID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioID = table.Column<int>(type: "int", nullable: false),
                    FechaOrden = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MontoTotal = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ordenes", x => x.OrdenID);
                    table.ForeignKey(
                        name: "FK_Ordenes_Usuarios_UsuarioID",
                        column: x => x.UsuarioID,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Alojamientos",
                columns: table => new
                {
                    AlojamientoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ciudad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Direccion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrecioPorNoche = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Categoria = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DestinoID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alojamientos", x => x.AlojamientoID);
                    table.ForeignKey(
                        name: "FK_Alojamientos_Destinos_DestinoID",
                        column: x => x.DestinoID,
                        principalTable: "Destinos",
                        principalColumn: "DestinoID");
                });

            migrationBuilder.CreateTable(
                name: "Tours",
                columns: table => new
                {
                    TourID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Precio = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    DuracionDias = table.Column<int>(type: "int", nullable: false),
                    DestinoID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tours", x => x.TourID);
                    table.ForeignKey(
                        name: "FK_Tours_Destinos_DestinoID",
                        column: x => x.DestinoID,
                        principalTable: "Destinos",
                        principalColumn: "DestinoID");
                });

            migrationBuilder.CreateTable(
                name: "Transportes",
                columns: table => new
                {
                    TransporteID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreRuta = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrigenDestinoID = table.Column<int>(type: "int", nullable: false),
                    DestinoFinalDestinoID = table.Column<int>(type: "int", nullable: false),
                    TipoVehiculo = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transportes", x => x.TransporteID);
                    table.ForeignKey(
                        name: "FK_Transportes_Destinos_DestinoFinalDestinoID",
                        column: x => x.DestinoFinalDestinoID,
                        principalTable: "Destinos",
                        principalColumn: "DestinoID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transportes_Destinos_OrigenDestinoID",
                        column: x => x.OrigenDestinoID,
                        principalTable: "Destinos",
                        principalColumn: "DestinoID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DetalleOrden",
                columns: table => new
                {
                    DetalleOrdenID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrdenID = table.Column<int>(type: "int", nullable: false),
                    TipoProducto = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductoID = table.Column<int>(type: "int", nullable: false),
                    Cantidad = table.Column<int>(type: "int", nullable: false),
                    PrecioUnitario = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetalleOrden", x => x.DetalleOrdenID);
                    table.ForeignKey(
                        name: "FK_DetalleOrden_Ordenes_OrdenID",
                        column: x => x.OrdenID,
                        principalTable: "Ordenes",
                        principalColumn: "OrdenID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PaqueteServicios",
                columns: table => new
                {
                    PaqueteServicioID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PaqueteID = table.Column<int>(type: "int", nullable: false),
                    TipoServicio = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TourID = table.Column<int>(type: "int", nullable: true),
                    AlojamientoID = table.Column<int>(type: "int", nullable: true),
                    TransporteID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaqueteServicios", x => x.PaqueteServicioID);
                    table.ForeignKey(
                        name: "FK_PaqueteServicios_Alojamientos_AlojamientoID",
                        column: x => x.AlojamientoID,
                        principalTable: "Alojamientos",
                        principalColumn: "AlojamientoID");
                    table.ForeignKey(
                        name: "FK_PaqueteServicios_Paquetes_PaqueteID",
                        column: x => x.PaqueteID,
                        principalTable: "Paquetes",
                        principalColumn: "PaqueteID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PaqueteServicios_Tours_TourID",
                        column: x => x.TourID,
                        principalTable: "Tours",
                        principalColumn: "TourID");
                    table.ForeignKey(
                        name: "FK_PaqueteServicios_Transportes_TransporteID",
                        column: x => x.TransporteID,
                        principalTable: "Transportes",
                        principalColumn: "TransporteID");
                });

            migrationBuilder.CreateTable(
                name: "TransporteTarifas",
                columns: table => new
                {
                    TarifaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TransporteID = table.Column<int>(type: "int", nullable: false),
                    NombreServicio = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Precio = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    DescripcionServicio = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransporteTarifas", x => x.TarifaID);
                    table.ForeignKey(
                        name: "FK_TransporteTarifas_Transportes_TransporteID",
                        column: x => x.TransporteID,
                        principalTable: "Transportes",
                        principalColumn: "TransporteID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Alojamientos_DestinoID",
                table: "Alojamientos",
                column: "DestinoID");

            migrationBuilder.CreateIndex(
                name: "IX_Destinos_RegionID",
                table: "Destinos",
                column: "RegionID");

            migrationBuilder.CreateIndex(
                name: "IX_DetalleOrden_OrdenID",
                table: "DetalleOrden",
                column: "OrdenID");

            migrationBuilder.CreateIndex(
                name: "IX_Ordenes_UsuarioID",
                table: "Ordenes",
                column: "UsuarioID");

            migrationBuilder.CreateIndex(
                name: "IX_PaqueteServicios_AlojamientoID",
                table: "PaqueteServicios",
                column: "AlojamientoID");

            migrationBuilder.CreateIndex(
                name: "IX_PaqueteServicios_PaqueteID",
                table: "PaqueteServicios",
                column: "PaqueteID");

            migrationBuilder.CreateIndex(
                name: "IX_PaqueteServicios_TourID",
                table: "PaqueteServicios",
                column: "TourID");

            migrationBuilder.CreateIndex(
                name: "IX_PaqueteServicios_TransporteID",
                table: "PaqueteServicios",
                column: "TransporteID");

            migrationBuilder.CreateIndex(
                name: "IX_Tours_DestinoID",
                table: "Tours",
                column: "DestinoID");

            migrationBuilder.CreateIndex(
                name: "IX_Transportes_DestinoFinalDestinoID",
                table: "Transportes",
                column: "DestinoFinalDestinoID");

            migrationBuilder.CreateIndex(
                name: "IX_Transportes_OrigenDestinoID",
                table: "Transportes",
                column: "OrigenDestinoID");

            migrationBuilder.CreateIndex(
                name: "IX_TransporteTarifas_TransporteID",
                table: "TransporteTarifas",
                column: "TransporteID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DetalleOrden");

            migrationBuilder.DropTable(
                name: "PaqueteServicios");

            migrationBuilder.DropTable(
                name: "TransporteTarifas");

            migrationBuilder.DropTable(
                name: "Ordenes");

            migrationBuilder.DropTable(
                name: "Alojamientos");

            migrationBuilder.DropTable(
                name: "Paquetes");

            migrationBuilder.DropTable(
                name: "Tours");

            migrationBuilder.DropTable(
                name: "Transportes");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Destinos");

            migrationBuilder.DropTable(
                name: "Regiones");
        }
    }
}
