using AutoMapper;
using ProyTour_Transporte_Hospedaje.Dtos.DestinoDto;
using ProyTour_Transporte_Hospedaje.Models;
using System;

namespace ProyTour_Transporte_Hospedaje.Profiles
{
    public class DestinoProfile : Profile
    {
        public DestinoProfile()
        {
            // Lectura
            CreateMap<Destino, DestinoReadDto>()
                .ForMember(dest => dest.NombreDepartamento, opt => opt.MapFrom(src =>
                    src.IdDepartamentoNavigation.NombreDepartamento
                ));

            
        }
    }

}