using AutoMapper;
using BrigadeWebService_BLL.Dto.Donations;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Mapper.Vacancies
{
    public class DonationProfile : Profile
    {
        public DonationProfile()
        {
            CreateMap<Donation, DonationCreateModel>().ReverseMap();
        }
    }
}
