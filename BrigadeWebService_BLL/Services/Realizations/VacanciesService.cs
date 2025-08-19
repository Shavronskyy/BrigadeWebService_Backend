using AutoMapper;
using BrigadeWebService_BLL.Dto.Vacancies;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Vacancies;
using Microsoft.Extensions.DependencyInjection;

namespace BrigadeWebService_BLL.Services.Realizations
{
    public class VacanciesService
    {
        private IVacancyRepository _vacancyRepository;
        private IMapper _mapper;

        public VacanciesService(IServiceProvider serviceProvider, IMapper mapper)
        {
            _vacancyRepository = serviceProvider.GetRequiredService<IVacancyRepository>();
            _mapper = mapper;
        }

        public async Task<IEnumerable<Vacancy>> GetVacanciesAsync()
        {
            return await _vacancyRepository.GetAll();
        }

        public async Task<Vacancy?> CreateAsync(VacancyCreateModel model)
        {
            var entity = _mapper.Map<Vacancy>(model);
            var vacancy = await _vacancyRepository.CreateAsync(entity);
            if (vacancy != null)
            {
                await _vacancyRepository.SaveChangesAsync();
                return vacancy;
            }
            return null;
        }

        public async Task<Vacancy?> UpdateAsync(VacancyCreateModel model)
        {
            var vacancy = await _vacancyRepository.GetById(model.Id);
            if(vacancy == null)
            {
                throw new InvalidOperationException("Vacancy not found");
            }
            var updatedVacancy = _vacancyRepository.Update(vacancy);
            if (updatedVacancy != null)
            {
                await _vacancyRepository.SaveChangesAsync();
                return updatedVacancy;
            }
            return null;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var vacancy = await _vacancyRepository.GetById(id);
            if (vacancy != null)
            {
                try
                {
                    _vacancyRepository.Delete(vacancy);
                }
                catch (Exception)
                {
                    return false;
                }
                await _vacancyRepository.SaveChangesAsync();
            }
            return true;
        }
    }
}
