using BrigadeWebService_BLL.Dto.Vacancies;
using BrigadeWebService_BLL.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BrigadeWebService_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VacancyController : Controller
    {
        private IVacanciesService _vacancyService;

        public VacancyController(IVacanciesService vacancyService)
        {
            _vacancyService = vacancyService;
        }

        [HttpGet("getAllVacancies")]
        public async Task<IActionResult> GetAllVacancies()
        {
            var data = await _vacancyService.GetVacanciesAsync();
            return data.Any() ? Ok(data) : NoContent();
        }

        [HttpPost("createVacancy")]
        public async Task<IActionResult> CreateVacancy([FromBody] VacancyCreateModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid model");
            }
            var vacancy = await _vacancyService.CreateAsync(model);
            return vacancy != null ? Ok(vacancy) : BadRequest("Failed to create vacancy");
        }

        [HttpPut("updateVacancy")]
        public async Task<IActionResult> UpdateVacancy([FromBody] VacancyCreateModel model)
        {
            if (model == null || model.Id <= 0)
            {
                return BadRequest("Invalid model");
            }
            var updatedVacancy = await _vacancyService.UpdateAsync(model);
            return updatedVacancy != null ? Ok(updatedVacancy) : NotFound("Vacancy not found");
        }

        [HttpDelete("deleteVacancy/{id}")]
        public async Task<IActionResult> DeleteVacancy(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid ID");
            }
            var result = await _vacancyService.DeleteAsync(id);
            return result ? Ok("Vacancy deleted successfully") : NotFound("Vacancy not found");
        }
    }
}
