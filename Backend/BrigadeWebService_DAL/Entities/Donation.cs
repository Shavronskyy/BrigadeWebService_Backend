using BrigadeWebService_DAL.Entities.Base;

namespace BrigadeWebService_DAL.Entities
{
    public class Donation : IBaseEntity
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public long Goal { get; set; }
        public DateTime CreationDate { get; set; }
        public string DonationLink { get; set; }
        public string Img { get; set; } = string.Empty;
        public bool IsCompleted { get; set; } = false;
    }
}
