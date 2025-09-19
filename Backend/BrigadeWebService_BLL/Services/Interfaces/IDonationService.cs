using BrigadeWebService_BLL.Dto.Donations;
using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Services.Interfaces.Base;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Services.Interfaces
{
    public interface IDonationService : IBaseCrudService<Donation, DonationCreateModel, DonationUpdateModel>
    {
        Task<bool> UpdateImageAsync(int donationId, string imgUrl);
        Task<bool> CreateReportAsync(int id, ReportCreateModel model);
        Task<bool> ChangeDonationStateAsync(int id);
        Task<IEnumerable<Report>> GetReportsByDonationIdAsync(int donationId);
    }
}
