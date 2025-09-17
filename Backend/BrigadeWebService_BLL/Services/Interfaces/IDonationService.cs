using BrigadeWebService_BLL.Dto.Donations;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Services.Interfaces
{
    public interface IDonationService
    {
        Task<IEnumerable<Donation>> GetAllAsync();
        Task<Donation?> CreateAsync(DonationCreateModel model);
        Task<Donation?> UpdateAsync(DonationCreateModel model);
        Task<bool> DeleteAsync(int id);
        Task<bool> UpdateImageAsync(int donationId, string imgUrl);
    }
}
