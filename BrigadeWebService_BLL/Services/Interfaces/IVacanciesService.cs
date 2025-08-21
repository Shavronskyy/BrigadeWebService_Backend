using BrigadeWebService_BLL.Dto.Vacancies;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Services.Interfaces
{
    public interface IVacanciesService
    {
        Task<IEnumerable<Vacancy>> GetVacanciesAsync();
        Task<Vacancy?> CreateAsync(VacancyCreateModel model);
        Task<Vacancy?> UpdateAsync(VacancyCreateModel model);
        Task<bool> DeleteAsync(int id);
    }
}
