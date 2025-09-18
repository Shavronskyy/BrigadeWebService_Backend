using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Services.Interfaces.Base;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Services.Interfaces
{
    public interface IReportsService : IBaseCrudService<Report, ReportCreateModel>
    {
        Task<bool> UpdateImageAsync(int reportId, string imgUrl);
    }
}
