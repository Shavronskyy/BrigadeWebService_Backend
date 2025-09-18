using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Services.Interfaces.Base
{
    public interface IBaseCrudService<TEntity, TCreateModel>
    {
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task<TEntity?> GetByIdAsync(int id);
        Task<TEntity?> CreateAsync(TCreateModel model);
        Task<TEntity?> UpdateAsync(TCreateModel model);
        Task<bool> DeleteAsync(int id);
    }
}
