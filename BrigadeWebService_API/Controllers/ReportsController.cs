using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Options;
using BrigadeWebService_BLL.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BrigadeWebService_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : Controller
    {
        private IReportsService _reportService;

        public ReportsController(IReportsService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("getAllReports")]
        public async Task<IActionResult> GetAllReports()
        {
            var data = await _reportService.GetAllReportsAsync();
            return data.Any() ? Ok(data) : NoContent();
        }

        [HttpPost("createReport")]
        public async Task<IActionResult> CreateReport([FromBody] ReportCreateModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid model");
            }
            var report = await _reportService.CreateAsync(model);
            return report != null ? Ok(report) : BadRequest("Failed to create report");
        }

        [HttpPut("updateReport")]
        public async Task<IActionResult> UpdateReport([FromBody] ReportCreateModel model)
        {
            if (model == null || model.Id <= 0)
            {
                return BadRequest("Invalid model");
            }
            var updatedReport = await _reportService.UpdateAsync(model);
            return updatedReport != null ? Ok(updatedReport) : NotFound("Report not found");
        }

        [HttpDelete("deleteReport/{id}")]
        public async Task<IActionResult> DeleteVacancy(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid ID");
            }
            var result = await _reportService.DeleteAsync(id);
            return result ? Ok("Report deleted successfully") : NotFound("Report not found");
        }

        [HttpPost("{id:int}/image")]
        [RequestSizeLimit(15_000_000)] // запас над MaxSizeBytes
        public async Task<IActionResult> UploadImage(
    int id,
    [FromForm] IFormFile file,
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

            // Переконаймося, що звіт існує
            var report = (await _reportService.GetAllReportsAsync()).FirstOrDefault(r => r.Id == id);
            if (report == null) return NotFound("Report not found");

            // Папка призначення: wwwroot/<BaseFolder>/yyyy/MM/{guid}.ext
            var yyyy = DateTime.UtcNow.Year.ToString("D4");
            var mm = DateTime.UtcNow.Month.ToString("D2");

            var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
            var relativeDir = Path.Combine(o.BaseFolder, yyyy, mm); // uploads/reports/2025/08
            var absDir = Path.Combine(webRoot, relativeDir);
            Directory.CreateDirectory(absDir);

            var fileName = $"{Guid.NewGuid():N}{ext}";
            var absPath = Path.Combine(absDir, fileName);
            await using (var stream = new FileStream(absPath, FileMode.Create))
                await file.CopyToAsync(stream);

            var relativeUrl = "/" + Path.Combine(relativeDir, fileName).Replace('\\', '/'); // /uploads/reports/2025/08/xxxx.webp

            // (опц.) видалити попереднє зображення, якщо було і воно з /uploads/
            if (!string.IsNullOrWhiteSpace(report.Img) && report.Img.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
            {
                var oldAbs = Path.Combine(webRoot, report.Img.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                if (System.IO.File.Exists(oldAbs))
                {
                    try { System.IO.File.Delete(oldAbs); } catch { /* ignore */ }
                }
            }

            var ok = await _reportService.UpdateImageAsync(id, relativeUrl);
            return ok ? Ok(new { url = relativeUrl }) : BadRequest("Failed to save image path");
        }

        [HttpDelete("{id:int}/image")]
        public async Task<IActionResult> DeleteImage(
            int id,
            [FromServices] IWebHostEnvironment env)
        {
            var report = (await _reportService.GetAllReportsAsync()).FirstOrDefault(r => r.Id == id);
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

            await _reportService.UpdateImageAsync(id, string.Empty);
            return NoContent();
        }
    }
}
