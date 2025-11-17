using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using KillasTravel.Domain.Entities; // Necesita esta referencia para las entidades

namespace KillasTravel.Infrastructure.BD
{
    // Asegúrate de que tus entidades (Tour, Usuario, etc.) ya estén en KillasTravel.Domain/Entities
    public class KillasTravelDbContext : DbContext
    {
        public KillasTravelDbContext(DbContextOptions<KillasTravelDbContext> options)
            : base(options)
        {
        }

        // --- DbSets para Mapear las Tablas ---
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Region> Regiones { get; set; }
        public DbSet<Destino> Destinos { get; set; }
        public DbSet<Tour> Tours { get; set; }
        public DbSet<Alojamiento> Alojamientos { get; set; }
        public DbSet<Transporte> Transportes { get; set; }
        public DbSet<Paquete> Paquetes { get; set; }
        public DbSet<PaqueteServicio> PaqueteServicios { get; set; }
        public DbSet<Orden> Ordenes { get; set; }
        public DbSet<DetalleOrden> DetalleOrden { get; set; }
        public DbSet<TransporteTarifa> TransporteTarifas { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Esto le dice a EF Core que OrigenDestinoID y DestinoFinalDestinoID son claves foráneas
            modelBuilder.Entity<Transporte>()
                .HasOne(t => t.Origen)
                .WithMany()
                .HasForeignKey(t => t.OrigenDestinoID)
                .OnDelete(DeleteBehavior.Restrict); // Evita eliminación en cascada si se borra un destino

            modelBuilder.Entity<Transporte>()
                .HasOne(t => t.DestinoFinal)
                .WithMany()
                .HasForeignKey(t => t.DestinoFinalDestinoID)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}