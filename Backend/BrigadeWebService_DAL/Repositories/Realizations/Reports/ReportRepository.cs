using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Reports;
using BrigadeWebService_DAL.Repositories.Realizations.Base;

namespace BrigadeWebService_DAL.Repositories.Realizations.Vacancies
{
    public class ReportRepository : RepositoryBase<Report>, IReportRepository
    {
        public ReportRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<Report>> GetReportsByDonationIdAsync(int donationId)
        {
            return await GetAllByCondition(r => r.DonationId == donationId);
        }
    }
}
