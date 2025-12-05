using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ProyTour_Transporte_Hospedaje.Models;

public partial class ViajeTourContext : DbContext
{
    public ViajeTourContext()
    {
    }

    public ViajeTourContext(DbContextOptions<ViajeTourContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Departamento> Departamento { get; set; }

    public virtual DbSet<Destino> Destino { get; set; }

    public virtual DbSet<Hospedaje> Hospedaje { get; set; }

    public virtual DbSet<Imagen> Imagen { get; set; }

    public virtual DbSet<Paquete> Paquete { get; set; }

    public virtual DbSet<PaqueteDetalle> PaqueteDetalle { get; set; }

    public virtual DbSet<Rol> Rol { get; set; }

    public virtual DbSet<Servicio> Servicio { get; set; }

    public virtual DbSet<Tour> Tour { get; set; }

    public virtual DbSet<Transporte> Transporte { get; set; }

    public virtual DbSet<Usuario> Usuario { get; set; }

    public virtual DbSet<VentaDetalle> VentaDetalle { get; set; }

    public virtual DbSet<Venta> Venta { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
=> optionsBuilder.UseSqlServer("Server=DESKTOP-RS3L4TB\\MSSQLSERVER2022;Database=viaje_tour;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Departamento>(entity =>
        {
            entity.HasKey(e => e.IdDepartamento).HasName("PK__Departam__64F37A1687831A8F");

            entity.ToTable("Departamento");

            entity.HasIndex(e => e.NombreDepartamento, "UQ__Departam__D90350F962EAEF27").IsUnique();

            entity.Property(e => e.IdDepartamento).HasColumnName("id_departamento");
            entity.Property(e => e.NombreDepartamento)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre_departamento");
        });

        modelBuilder.Entity<Destino>(entity =>
        {
            entity.HasKey(e => e.IdDestino).HasName("PK__Destino__F1DC09EA959403C8");

            entity.ToTable("Destino");

            entity.Property(e => e.IdDestino).HasColumnName("id_destino");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.IdDepartamento).HasColumnName("id_departamento");
            entity.Property(e => e.NombreDestino)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre_destino");

            entity.HasOne(d => d.IdDepartamentoNavigation).WithMany(p => p.Destinos)
                .HasForeignKey(d => d.IdDepartamento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Destino__id_depa__44FF419A");
        });

        modelBuilder.Entity<Hospedaje>(entity =>
        {
            entity.HasKey(e => e.IdHospedaje).HasName("PK__Hospedaj__C4C28395547B0FB2");

            entity.ToTable("Hospedaje");

            entity.Property(e => e.IdHospedaje).HasColumnName("id_hospedaje");
            entity.Property(e => e.Capacidad).HasColumnName("capacidad");
            entity.Property(e => e.IdDestino).HasColumnName("id_destino");
            entity.Property(e => e.IdServicio).HasColumnName("id_servicio");
            entity.Property(e => e.RangoPrecio)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("rango_precio");
            entity.Property(e => e.ServiciosIncluidos)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("servicios_incluidos");

            entity.HasOne(d => d.IdDestinoNavigation).WithMany(p => p.Hospedajes)
                .HasForeignKey(d => d.IdDestino)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Hospedaje__id_de__4BAC3F29");

            entity.HasOne(d => d.IdServicioNavigation).WithMany(p => p.Hospedajes)
                .HasForeignKey(d => d.IdServicio)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Hospedaje__id_se__4AB81AF0");
        });

        modelBuilder.Entity<Imagen>(entity =>
        {
            entity.HasKey(e => e.IdImagen).HasName("PK__Imagen__27CC26897A68756D");

            entity.ToTable("Imagen");

            entity.Property(e => e.IdImagen).HasColumnName("id_imagen");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.IdEntidad).HasColumnName("id_entidad");
            entity.Property(e => e.TipoEntidad)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("tipo_entidad");
            entity.Property(e => e.Url)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("url");
        });

        modelBuilder.Entity<Paquete>(entity =>
        {
            entity.HasKey(e => e.IdPaquete).HasName("PK__Paquete__609C3BCB3E986A8B");

            entity.ToTable("Paquete");

            entity.Property(e => e.IdPaquete).HasColumnName("id_paquete");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.EsPromocion)
                .HasDefaultValueSql("((0))")
                .HasColumnName("es_promocion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.PrecioTotal)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("precio_total");
        });

        modelBuilder.Entity<PaqueteDetalle>(entity =>
        {
            entity.HasKey(e => e.IdPaqueteDetalle).HasName("PK__Paquete___8774D1AEC9F09498");

            entity.ToTable("Paquete_Detalle");

            entity.Property(e => e.IdPaqueteDetalle).HasColumnName("id_paquete_detalle");
            entity.Property(e => e.IdPaquete).HasColumnName("id_paquete");
            entity.Property(e => e.IdServicio).HasColumnName("id_servicio");

            entity.HasOne(d => d.IdPaqueteNavigation).WithMany(p => p.PaqueteDetalles)
                .HasForeignKey(d => d.IdPaquete)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Paquete_D__id_pa__5BE2A6F2");

            entity.HasOne(d => d.IdServicioNavigation).WithMany(p => p.PaqueteDetalles)
                .HasForeignKey(d => d.IdServicio)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Paquete_D__id_se__5CD6CB2B");
        });

        modelBuilder.Entity<Rol>(entity =>
        {
            entity.HasKey(e => e.IdRol).HasName("PK__Rol__6ABCB5E05DFEF662");

            entity.ToTable("Rol");

            entity.HasIndex(e => e.NombreRol, "UQ__Rol__673CB4357C3B30BC").IsUnique();

            entity.Property(e => e.IdRol).HasColumnName("id_rol");
            entity.Property(e => e.NombreRol)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("nombre_rol");
        });

        modelBuilder.Entity<Servicio>(entity =>
        {
            entity.HasKey(e => e.IdServicio).HasName("PK__Servicio__6FD07FDCF059F1DE");

            entity.ToTable("Servicio");

            entity.Property(e => e.IdServicio).HasColumnName("id_servicio");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(120)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.PrecioBase)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("precio_base");
            entity.Property(e => e.TipoServicio)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("tipo_servicio");
        });

        modelBuilder.Entity<Tour>(entity =>
        {
            entity.HasKey(e => e.IdTour).HasName("PK__Tour__C9304CF646FCF40D");

            entity.ToTable("Tour");

            entity.Property(e => e.IdTour).HasColumnName("id_tour");
            entity.Property(e => e.Duracion)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("duracion");
            entity.Property(e => e.GuiaIncluido)
                .HasDefaultValueSql("((0))")
                .HasColumnName("guia_incluido");
            entity.Property(e => e.IdDestino).HasColumnName("id_destino");
            entity.Property(e => e.IdServicio).HasColumnName("id_servicio");

            entity.HasOne(d => d.IdDestinoNavigation).WithMany(p => p.Tours)
                .HasForeignKey(d => d.IdDestino)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tour__id_destino__5070F446");

            entity.HasOne(d => d.IdServicioNavigation).WithMany(p => p.Tours)
                .HasForeignKey(d => d.IdServicio)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tour__id_servici__4F7CD00D");
        });

        modelBuilder.Entity<Transporte>(entity =>
        {
            entity.HasKey(e => e.IdTransporte).HasName("PK__Transpor__7AC9B3AEF6089272");

            entity.ToTable("Transporte");

            entity.Property(e => e.IdTransporte).HasColumnName("id_transporte");
            entity.Property(e => e.Categoria)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("categoria");
            entity.Property(e => e.FechaLlegada)
                .HasColumnType("datetime")
                .HasColumnName("fecha_llegada");
            entity.Property(e => e.FechaSalida)
                .HasColumnType("datetime")
                .HasColumnName("fecha_salida");
            entity.Property(e => e.IdDestino).HasColumnName("id_destino");
            entity.Property(e => e.IdOrigen).HasColumnName("id_origen");
            entity.Property(e => e.IdServicio).HasColumnName("id_servicio");

            entity.HasOne(d => d.IdDestinoNavigation).WithMany(p => p.TransporteIdDestinoNavigations)
                .HasForeignKey(d => d.IdDestino)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Transport__id_de__5629CD9C");

            entity.HasOne(d => d.IdOrigenNavigation).WithMany(p => p.TransporteIdOrigenNavigations)
                .HasForeignKey(d => d.IdOrigen)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Transport__id_or__5535A963");

            entity.HasOne(d => d.IdServicioNavigation).WithMany(p => p.Transportes)
                .HasForeignKey(d => d.IdServicio)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Transport__id_se__5441852A");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario).HasName("PK__Usuario__4E3E04AD7F9ED472");

            entity.ToTable("Usuario", tb => tb.HasTrigger("trg_Usuario_DefaultRol"));

            entity.HasIndex(e => e.Email, "UQ__Usuario__AB6E6164F423C536").IsUnique();

            entity.HasIndex(e => e.Dni, "UQ__Usuario__D87608A758981E52").IsUnique();

            entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");
            entity.Property(e => e.Apellido)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("apellido");
            entity.Property(e => e.Dni)
                .HasMaxLength(8)
                .IsUnicode(false)
                .HasColumnName("dni");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password_hash");
            entity.Property(e => e.Telefono)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("telefono");

            entity.HasMany(d => d.IdRols).WithMany(p => p.IdUsuarios)
                .UsingEntity<Dictionary<string, object>>(
                    "UsuarioRol",
                    r => r.HasOne<Rol>().WithMany()
                        .HasForeignKey("IdRol")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Usuario_R__id_ro__3F466844"),
                    l => l.HasOne<Usuario>().WithMany()
                        .HasForeignKey("IdUsuario")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Usuario_R__id_us__3E52440B"),
                    j =>
                    {
                        j.HasKey("IdUsuario", "IdRol").HasName("PK__Usuario___5895CFF32BD5391C");
                        j.ToTable("Usuario_Rol");
                        j.IndexerProperty<int>("IdUsuario").HasColumnName("id_usuario");
                        j.IndexerProperty<int>("IdRol").HasColumnName("id_rol");
                    });
        });

        modelBuilder.Entity<VentaDetalle>(entity =>
        {
            entity.HasKey(e => e.IdVentaDetalle).HasName("PK__Venta_De__7AA8F41BF7B64F24");

            entity.ToTable("Venta_Detalle");

            entity.Property(e => e.IdVentaDetalle).HasColumnName("id_venta_detalle");
            entity.Property(e => e.Cantidad).HasColumnName("cantidad");
            entity.Property(e => e.IdPaquete).HasColumnName("id_paquete");
            entity.Property(e => e.IdServicio).HasColumnName("id_servicio");
            entity.Property(e => e.IdVenta).HasColumnName("id_venta");
            entity.Property(e => e.PrecioUnitario)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("precio_unitario");
            entity.Property(e => e.Subtotal)
                .HasComputedColumnSql("([cantidad]*[precio_unitario])", true)
                .HasColumnType("decimal(21, 2)")
                .HasColumnName("subtotal");
            entity.Property(e => e.TipoItem)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("tipo_item");

            entity.HasOne(d => d.IdPaqueteNavigation).WithMany(p => p.VentaDetalles)
                .HasForeignKey(d => d.IdPaquete)
                .HasConstraintName("FK__Venta_Det__id_pa__66603565");

            entity.HasOne(d => d.IdServicioNavigation).WithMany(p => p.VentaDetalles)
                .HasForeignKey(d => d.IdServicio)
                .HasConstraintName("FK__Venta_Det__id_se__656C112C");

            entity.HasOne(d => d.IdVentaNavigation).WithMany(p => p.VentaDetalles)
                .HasForeignKey(d => d.IdVenta)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Venta_Det__id_ve__6477ECF3");
        });

        modelBuilder.Entity<Venta>(entity =>
        {
            entity.HasKey(e => e.IdVenta).HasName("PK__Venta__459533BF4682124D");

            entity.Property(e => e.IdVenta).HasColumnName("id_venta");
            entity.Property(e => e.FechaVenta)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("fecha_venta");
            entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");
            entity.Property(e => e.Total)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("total");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Venta)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Venta__id_usuari__60A75C0F");
        });

        OnModelCreatingPartial(modelBuilder);
    }
   
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
