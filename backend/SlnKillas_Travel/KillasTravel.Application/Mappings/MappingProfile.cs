using AutoMapper;
using KillasTravel.Domain.Entities;
using KillasTravel.Application.DTOs;

namespace KillasTravel.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Mapeo de ejemplo para la respuesta limpia de Alojamientos
            CreateMap<Alojamiento, AlojamientoResponseDto>()
                .ForMember(dest => dest.NombreDestino,
                           opt => opt.MapFrom(src => src.Destino != null ? src.Destino.Nombre : "N/A"));

            // ... Y los demás mapeos (Tour, Transporte, etc.)
        }
    }
}