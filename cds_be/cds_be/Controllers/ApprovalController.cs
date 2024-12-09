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
    public class ApprovalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ApprovalController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Approval>>> GetApprovals()
        {
            return await _context.Approvals.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Approval>> GetApproval(int id)
        {
            var approval = await _context.Approvals.FindAsync(id);

            if (approval == null)
            {
                return NotFound();
            }

            return approval;
        }

        [HttpPost]
        public async Task<ActionResult<Approval>> AddApproval(Approval approval)
        {
            _context.Approvals.Add(approval);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetApproval), new { id = approval.ApprovalID }, approval);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditApproval(int id, Approval approval)
        {
            if (id != approval.ApprovalID)
            {
                return BadRequest();
            }

            _context.Entry(approval).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApprovalExists(id))
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
        public async Task<IActionResult> DeleteApproval(int id)
        {
            var approval = await _context.Approvals.FindAsync(id);
            if (approval == null)
            {
                return NotFound();
            }

            _context.Approvals.Remove(approval);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ApprovalExists(int id)
        {
            return _context.Approvals.Any(e => e.ApprovalID == id);
        }
    }
}