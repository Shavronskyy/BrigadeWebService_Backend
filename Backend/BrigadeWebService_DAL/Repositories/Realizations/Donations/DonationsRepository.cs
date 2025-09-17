using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Donations;
using BrigadeWebService_DAL.Repositories.Realizations.Base;

namespace BrigadeWebService_DAL.Repositories.Realizations.Donations
{
    public class DonationsRepository : RepositoryBase<Donation>, IDonationsRepository
    {
        public DonationsRepository(AppDbContext dbContext) : base(dbContext)
        {
        }
    }
}
