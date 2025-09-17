using AutoMapper;
using BrigadeWebService_BLL.Dto.Donations;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Donations;

namespace BrigadeWebService_BLL.Services.Realizations
{
    public class DonationService : IDonationService
    {
        private readonly IDonationsRepository _donationRepository;
        private readonly IMapper _mapper;

        public DonationService(IDonationsRepository donationRepository, IMapper mapper)
        {
            _donationRepository = donationRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Donation>> GetAllAsync()
        {
            return await _donationRepository.GetAll();
        }

        public async Task<Donation?> CreateAsync(DonationCreateModel model)
        {
            var entity = _mapper.Map<Donation>(model);
            var vacancy = await _donationRepository.CreateAsync(entity);
            if (vacancy != null)
            {
                await _donationRepository.SaveChangesAsync();
                return vacancy;
            }
            return null;
        }

        public async Task<Donation?> UpdateAsync(DonationCreateModel model)
        {
            var donate = await _donationRepository.GetById(model.Id);
            if (donate == null)
            {
                throw new InvalidOperationException($"Донат {model.Title} не знайдено!");
            }
            _mapper.Map(model, donate);

            return await _donationRepository.SaveChangesAsync() == 1 ? donate : null;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var donate = await _donationRepository.GetById(id);
            if (donate != null)
            {
                try
                {
                    _donationRepository.Delete(donate);
                }
                catch (Exception)
                {
                    return false;
                }
                await _donationRepository.SaveChangesAsync();
            }
            return true;
        }

        public async Task<bool> UpdateImageAsync(int donationId, string imgUrl)
        {
            var entity = await _donationRepository.GetById(donationId);
            if (entity == null) return false;
            entity.Img = imgUrl;
            return await _donationRepository.SaveChangesAsync() == 1;
        }
    }
}
