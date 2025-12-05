using ProyTour_Transporte_Hospedaje.Dtos.HospedajeDto;
using ProyTour_Transporte_Hospedaje.Models;

namespace ProyTour_Transporte_Hospedaje.Interfaces
{
    public interface IHospedajeRepository
    {

        Task<IEnumerable<HospedajeReadDto>> ObtenerTodosDtoAsync();

      
        Task<Hospedaje?> ObtenerPorIdAsync(int idHospedaje);


        Task CrearHospedajeAsync(Servicio servicio, Hospedaje hospedaje);


        void Actualizar(Servicio servicio, Hospedaje hospedaje); 

 
        void Eliminar(Servicio servicio, Hospedaje hospedaje); 

       
        Task<bool> GuardarCambiosAsync();
    }
}
