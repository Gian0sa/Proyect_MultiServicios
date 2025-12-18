using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace ProyTour_Transporte_Hospedaje.Services
{
    public interface IEmailService
    {
        Task EnviarCorreoNuevaVentaAsync(int idVenta, decimal total);
    }

    public class EmailService : IEmailService
    {
        public async Task EnviarCorreoNuevaVentaAsync(int idVenta, decimal total)
        {
            var mensaje = new MailMessage();
            mensaje.From = new MailAddress("TU_CORREO@gmail.com");
            mensaje.To.Add("Giepeton558@gmail.com");
            mensaje.Subject = "📦 Nueva venta registrada";
            mensaje.Body = $@"
Se ha registrado una nueva venta:

ID Venta: {idVenta}
Total: S/ {total}

Revisa el panel de administración.
";
            mensaje.IsBodyHtml = false;

            var smtp = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(
                    "TU_CORREO@gmail.com",
                    "TU_CONTRASEÑA_DE_APLICACION"
                ),
                EnableSsl = true
            };

            await smtp.SendMailAsync(mensaje);
        }
    }
}
