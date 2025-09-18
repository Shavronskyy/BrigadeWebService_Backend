using AutoMapper;
using BrigadeWebService_BLL.Dto.Donations;
using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations.Base;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Donations;
using BrigadeWebService_DAL.Repositories.Interfaces.Reports;
using BrigadeWebService_DAL.Repositories.Realizations.Vacancies;

namespace BrigadeWebService_BLL.Services.Realizations
{
    public class DonationService : BaseCrudService<Donation, DonationCreateModel>, IDonationService
    {
        private readonly IDonationsRepository _donationRepository;
        private readonly IReportsService _reportsService;
        private readonly IMapper _mapper;

        public DonationService(IDonationsRepository donationRepository, IMapper mapper, IReportsService reportsService) : base(donationRepository, mapper)
        {
            _donationRepository = donationRepository;
            _reportsService = reportsService;
            _mapper = mapper;
        }

        public async Task<bool> UpdateImageAsync(int donationId, string imgUrl)
        {
            var entity = await _donationRepository.GetByIdAsync(donationId);
            if (entity == null) return false;
            entity.Img = imgUrl;
            return await _donationRepository.SaveChangesAsync() == 1;
        }

        public async Task<bool> CreateReportAsync(int donationId, ReportCreateModel model)
        {
            // First, verify the donation exists
            var donation = await _donationRepository.GetByIdAsync(donationId);
            if (donation == null)
            {
                throw new InvalidOperationException($"Donation with Id: {donationId} doesn't exist!");
            }

            model.DonationId = donationId;

            // Add to repository and save
            await _reportsService.CreateAsync(model);
            var result = await _donationRepository.SaveChangesAsync();

            return result == 1;
        }

        public async Task<bool> ChangeDonationStateAsync(int id)
        {
            var donation = await _donationRepository.GetByIdAsync(id);
            if(donation == null) throw new InvalidOperationException($"Donate with Id: {id} doesnt exist!");
            donation.IsCompleted = !donation.IsCompleted;
            return await _donationRepository.SaveChangesAsync() == 1;
        }
    }
}
