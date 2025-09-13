using AutoMapper;
using BrigadeWebService_BLL.Dto.Vacancies;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Vacancies;

namespace BrigadeWebService_BLL.Services.Realizations
{
    public class VacanciesService : IVacanciesService
    {
        private readonly IVacancyRepository _vacancyRepository;
        private readonly IMapper _mapper;

        public VacanciesService(IVacancyRepository vacancyRepository, IMapper mapper)
        {
            _vacancyRepository = vacancyRepository;
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
                throw new InvalidOperationException($"Вакансія {model.Title} не знайдена!");
            }
            _mapper.Map(model, vacancy);

            return await _vacancyRepository.SaveChangesAsync() == 1 ? vacancy : null;
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
