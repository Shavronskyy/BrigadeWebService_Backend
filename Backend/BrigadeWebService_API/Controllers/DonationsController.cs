using BrigadeWebService_BLL.Dto.Donations;
using BrigadeWebService_BLL.Options;
using BrigadeWebService_BLL.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BrigadeWebService_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonationsController : Controller
    {
        private IDonationService _donationService;

        public DonationsController(IDonationService donationService)
        {
            _donationService = donationService;
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _donationService.GetAllDonationsAsync();
            return data.Any() ? Ok(data) : NoContent();
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] DonationCreateModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid model");
            }
            var donation = await _donationService.CreateAsync(model);
            return donation != null ? Ok(donation) : BadRequest("Failed to create donation");
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] DonationCreateModel model)
        {
            if (model == null || model.Id <= 0)
            {
                return BadRequest("Invalid model");
            }
            var updated = await _donationService.UpdateAsync(model);
            return updated != null ? Ok(updated) : NotFound("Donation not found");
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid ID");
            }
            var result = await _donationService.DeleteAsync(id);
            return result ? Ok("Donation deleted successfully") : NotFound("Donation not found");
        }

        [HttpPost("{id:int}/image")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(15_000_000)]
        public async Task<IActionResult> UploadImage(
    int id,
    IFormFile file,
    [FromServices] IOptions<UploadOptions> options,
    [FromServices] IWebHostEnvironment env)
        {
            if (file == null || file.Length == 0) return BadRequest("No file");

            var o = options.Value;
            if (file.Length > o.MaxSizeBytes)
                return BadRequest($"Max size {o.MaxSizeBytes / 1024 / 1024} MB");

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!o.AllowedExtensions.Contains(ext))
                return BadRequest("Unsupported file type");

            var report = (await _donationService.GetAllDonationsAsync()).FirstOrDefault(r => r.Id == id);
            if (report == null) return NotFound("Report not found");

            var yyyy = DateTime.UtcNow.Year.ToString("D4");
            var mm = DateTime.UtcNow.Month.ToString("D2");

            var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
            var relativeDir = Path.Combine(o.BaseFolder, yyyy, mm);
            var absDir = Path.Combine(webRoot, relativeDir);
            Directory.CreateDirectory(absDir);

            var fileName = $"{Guid.NewGuid():N}{ext}";
            var absPath = Path.Combine(absDir, fileName);
            await using (var stream = new FileStream(absPath, FileMode.Create))
                await file.CopyToAsync(stream);

            var relativeUrl = "/" + Path.Combine(relativeDir, fileName).Replace('\\', '/');

            if (!string.IsNullOrWhiteSpace(report.Img) &&
                report.Img.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
            {
                var oldAbs = Path.Combine(webRoot, report.Img.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                if (System.IO.File.Exists(oldAbs))
                {
                    try { System.IO.File.Delete(oldAbs); } catch { /* ignore */ }
                }
            }

            var ok = await _donationService.UpdateImageAsync(id, relativeUrl);
            return ok ? Ok(new { url = relativeUrl }) : BadRequest("Failed to save image path");
        }


        [HttpDelete("{id:int}/image")]
        public async Task<IActionResult> DeleteImage(
            int id,
            [FromServices] IWebHostEnvironment env)
        {
            var report = (await _donationService.GetAllDonationsAsync()).FirstOrDefault(r => r.Id == id);
            if (report == null) return NotFound("Report not found");

            if (!string.IsNullOrWhiteSpace(report.Img) && report.Img.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
            {
                var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
                var abs = Path.Combine(webRoot, report.Img.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                if (System.IO.File.Exists(abs))
                {
                    try { System.IO.File.Delete(abs); } catch { /* ignore */ }
                }
            }

            await _donationService.UpdateImageAsync(id, string.Empty);
            return NoContent();
        }
    }
}
