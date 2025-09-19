using BrigadeWebService_API.Controllers.Base;
using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Options;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BrigadeWebService_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : BaseCRUDController<Report, ReportCreateModel, ReportUpdateModel>
    {
        private IReportsService _reportService;

        public ReportsController(IReportsService reportService) : base(reportService)
        {
            _reportService = reportService;
        }

        [HttpPost("{id:int}/image")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(15_000_000)]
        public async Task<IActionResult> UploadImage(
    int id,
    IFormFile file, // ← без [FromForm]
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

            var report = (await _reportService.GetAllAsync()).FirstOrDefault(r => r.Id == id);
            if (report == null) return NotFound("Report not found");

            var yyyy = DateTime.UtcNow.Year.ToString("D4");
            var mm = DateTime.UtcNow.Month.ToString("D2");

            var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
            var relativeDir = Path.Combine(o.BaseFolder, yyyy, mm); // uploads/reports/2025/09
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

            var ok = await _reportService.UpdateImageAsync(id, relativeUrl);
            return ok ? Ok(new { url = relativeUrl }) : BadRequest("Failed to save image path");
        }


        [HttpDelete("{id:int}/image")]
        public async Task<IActionResult> DeleteImage(
            int id,
            [FromServices] IWebHostEnvironment env)
        {
            var report = (await _reportService.GetAllAsync()).FirstOrDefault(r => r.Id == id);
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
