using AutoMapper;
using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Reports;

namespace BrigadeWebService_BLL.Services.Realizations
{
    public class ReportsService : IReportsService
    {
        private readonly IReportRepository _reportRepository;
        private readonly IMapper _mapper;

        public ReportsService(IReportRepository reportRepository, IMapper mapper)
        {
            _reportRepository = reportRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Report>> GetAllReportsAsync()
        {
            return await _reportRepository.GetAll();
        }

        public async Task<Report?> CreateAsync(ReportCreateModel model)
        {
            var entity = _mapper.Map<Report>(model);
            var vacancy = await _reportRepository.CreateAsync(entity);
            if (vacancy != null)
            {
                await _reportRepository.SaveChangesAsync();
                return vacancy;
            }
            return null;
        }

        public async Task<Report?> UpdateAsync(ReportCreateModel model)
        {
            var vacancy = await _reportRepository.GetById(model.Id);
            if(vacancy == null)
            {
                throw new InvalidOperationException($"Звіт {model.Title} не знайдено!");
            }
            _mapper.Map(model, vacancy);

            return await _reportRepository.SaveChangesAsync() == 1 ? vacancy : null;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var vacancy = await _reportRepository.GetById(id);
            if (vacancy != null)
            {
                try
                {
                    _reportRepository.Delete(vacancy);
                }
                catch (Exception)
                {
                    return false;
                }
                await _reportRepository.SaveChangesAsync();
            }
            return true;
        }

        public async Task<bool> UpdateImageAsync(int reportId, string imgUrl)
        {
            var entity = await _reportRepository.GetById(reportId);
            if (entity == null) return false;
            entity.Img = imgUrl;
            return await _reportRepository.SaveChangesAsync() == 1;
        }

    }
}
