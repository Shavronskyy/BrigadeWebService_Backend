using AutoMapper;
using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations.Base;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Reports;

namespace BrigadeWebService_BLL.Services.Realizations
{
    public class ReportsService : BaseCrudService<Report, ReportCreateModel>, IReportsService
    {
        private readonly IReportRepository _reportRepository;
        private readonly IMapper _mapper;

        public ReportsService(IReportRepository reportRepository, IMapper mapper) : base(reportRepository, mapper)
        {
            _reportRepository = reportRepository;
            _mapper = mapper;
        }

        public async Task<bool> UpdateImageAsync(int reportId, string imgUrl)
        {
            var entity = await _reportRepository.GetByIdAsync(reportId);
            if (entity == null) return false;
            entity.Img = imgUrl;
            return await _reportRepository.SaveChangesAsync() == 1;
        }

    }
}
