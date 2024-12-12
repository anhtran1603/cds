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
    public class ApplicationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ApplicationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>> GetApplications()
        {
            var data = await _context.Applications.Include(a => a.Companies).ToListAsync();
            return data;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Application>> GetApplication(string id)
        {
            var application = await _context.Applications.FindAsync(id);


            if (application == null)
            {
                return NotFound();
            }

            return application;
        }

        [HttpPost]
        public async Task<ActionResult<Application>> AddApplication(Application application)
        {
            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetApplication), new { id = application.ApplicationID }, application);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditApplication(string id, Application application)
        {
            if (id != application.ApplicationID)
            {
                return BadRequest();
            }

            _context.Entry(application).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicationExists(id))
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
        public async Task<IActionResult> DeleteApplication(string id)
        {
            var application = await _context.Applications.FindAsync(id);
            if (application == null)
            {
                return NotFound();
            }

            _context.Applications.Remove(application);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ApplicationExists(string id)
        {
            return _context.Applications.Any(e => e.ApplicationID == id);
        }
    }
}