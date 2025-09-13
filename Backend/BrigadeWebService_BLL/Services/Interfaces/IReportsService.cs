using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Services.Interfaces
{
    public interface IReportsService
    {
        Task<IEnumerable<Report>> GetAllReportsAsync();
        Task<Report?> CreateAsync(ReportCreateModel model);
        Task<Report?> UpdateAsync(ReportCreateModel model);
        Task<bool> DeleteAsync(int id);
        Task<bool> UpdateImageAsync(int reportId, string imgUrl);
    }
}
