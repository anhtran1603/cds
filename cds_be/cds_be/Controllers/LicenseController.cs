using Microsoft.AspNetCore.Mvc;
using cds_be.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace cds_be.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LicenseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LicenseController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<License>>> GetLicenses()
        {
            return await _context.Licenses.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<License>> GetLicense(int id)
        {
            var license = await _context.Licenses.FindAsync(id);

            if (license == null)
            {
                return NotFound();
            }

            return license;
        }



        [HttpGet("completed")]
        public async Task<ActionResult<IEnumerable<License>>> GetCompletedEmployeeLicenses()
        {
            var licenses = await _context.Licenses
                .Include(l => l.Employee)
                .ThenInclude(e => e.Application)
                .Where(l => l.Employee.Application.Status == "Đã hoàn thành")
                .ToListAsync();

            if (licenses == null || licenses.Count == 0)
            {
                return NotFound();
            }

            return licenses;
        }


        [HttpPost]
        public async Task<ActionResult<License>> AddLicense(License license)
        {
            _context.Licenses.Add(license);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLicense), new { id = license.LicenseID }, license);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditLicense(int id, License license)
        {
            if (id != license.LicenseID)
            {
                return BadRequest();
            }

            _context.Entry(license).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LicenseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLicense(int id)
        {
            var license = await _context.Licenses.FindAsync(id);
            if (license == null)
            {
                return NotFound();
            }

            _context.Licenses.Remove(license);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LicenseExists(int id)
        {
            return _context.Licenses.Any(e => e.LicenseID == id);
        }
    }
}